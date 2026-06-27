'use client'
import { useState, useEffect } from 'react'
import AdminLayout from './components/AdminLayout'

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sections, setSections] = useState([])
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === 'true') {
      setAuthed(true)
      loadData()
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (data.success) {
      sessionStorage.setItem('admin_authed', 'true')
      setAuthed(true)
      loadData()
    } else {
      setError('パスワードが違います')
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [secRes, cfgRes] = await Promise.all([
        fetch(process.env.NEXT_PUBLIC_GAS_API + '?sheet=セクション設定'),
        fetch(process.env.NEXT_PUBLIC_GAS_API + '?sheet=サイト全体設定'),
      ])
      const secData = await secRes.json()
      const cfgData = await cfgRes.json()
      setSections(secData)
      const cfg = {}
      cfgData.forEach(row => { cfg[row['項目キー']] = row['値'] })
      setConfig(cfg)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const toggleSection = async (sectionId, currentValue) => {
    setSaving(sectionId)
    const newValue = currentValue === 'TRUE' || currentValue === true ? 'FALSE' : 'TRUE'
    try {
      await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateSection', sectionId, value: newValue }),
      })
      setSections(prev => prev.map(s =>
        s['セクションID'] === sectionId ? { ...s, '表示': newValue } : s
      ))
    } catch (e) { console.error(e) }
    setSaving(null)
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '48px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a2744' }}>COCO&Bridge</div>
            <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>管理画面</div>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
            {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '6px', padding: '10px 14px', color: '#cc0000', fontSize: '13px' }}>{error}</div>}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '6px' }}>パスワード</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="パスワードを入力" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '15px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ background: '#1a2744', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>ログイン</button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <AdminLayout current="dashboard">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#999' }}>読み込み中...</div>
      </AdminLayout>
    )
  }

  const publishedServices = sections.filter(s => s['表示'] === true || s['表示'] === 'TRUE').length

  return (
    <AdminLayout current="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>ダッシュボード</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>サイトの状態を確認・管理できます</p>
        </div>
        <a href="https://coco-bridge.com" target="_blank" style={{ background: '#1a2744', color: 'white', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>🌐 サイトを確認</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: '表示中のセクション', value: publishedServices + ' / ' + sections.length, icon: '📄' },
          { label: 'サイト名', value: config.site_name || '-', icon: '🌐' },
          { label: 'CTAボタン', value: config.cta_text || '-', icon: '🔘' },
          { label: 'サイト状態', value: '公開中', icon: '✅', green: true },
        ].map((card, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{card.icon}</div>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>{card.label}</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: card.green ? '#27ae60' : '#1a2744' }}>{card.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1a2744' }}>セクション表示設定</h2>
          <span style={{ fontSize: '12px', color: '#999' }}>切り替えは即座にサイトに反映されます</span>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {sections.map((section) => {
            const isOn = section['表示'] === true || section['表示'] === 'TRUE'
            const isSaving = saving === section['セクションID']
            return (
              <div key={section['セクションID']} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '8px', background: '#f8f9fa', border: '1px solid #f0f0f0' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a2744' }}>{section['表示名']}</span>
                  <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>#{section['セクションID']}</span>
                </div>
                <button onClick={() => toggleSection(section['セクションID'], section['表示'])} disabled={isSaving} style={{ width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: isOn ? '#b8954a' : '#ddd', position: 'relative', opacity: isSaving ? 0.6 : 1 }}>
                  <div style={{ position: 'absolute', top: '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', left: isOn ? '25px' : '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'コンテンツ編集', desc: 'キャッチコピー・CTA', href: '/admin/content', icon: '✏️' },
          { label: 'サービス管理', desc: 'サービスの追加・編集', href: '/admin/services', icon: '🛠️' },
          { label: '基本設定', desc: 'カラー・通知メール', href: '/admin/settings', icon: '⚙️' },
        ].map((item, i) => (
          <a key={i} href={item.href} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>{item.label}</div>
            <div style={{ fontSize: '13px', color: '#999' }}>{item.desc}</div>
          </a>
        ))}
      </div>
    </AdminLayout>
  )
}
