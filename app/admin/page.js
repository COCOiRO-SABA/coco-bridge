'use client'
import { useState, useEffect } from 'react'
import AdminLayout from './components/AdminLayout'
const SECTION_CONFIG = [
  { id: 'hero', label: 'ヒーロー', desc: 'キャッチコピー・ボタン', editHref: '/admin/page-content', alwaysOn: true },
  { id: 'concept', label: 'コンセプト', desc: '会社説明・理念', editHref: '/admin/page-content' },
  { id: 'services', label: 'サービス', desc: 'サービス一覧', editHref: '/admin/services' },
  { id: 'profile', label: '代表プロフィール', desc: '代表者の紹介', editHref: '/admin/page-content' },
  { id: 'staff', label: 'スタッフ紹介', desc: 'スタッフ一覧', editHref: '/admin/staff-manage' },
  { id: 'voice', label: 'お客様の声', desc: '導入事例・声', editHref: '/admin/voice' },
  { id: 'news', label: 'お知らせ', desc: 'ブログ・ニュース', editHref: '/admin/news' },
  { id: 'access', label: 'アクセス', desc: '住所・地図・営業時間', editHref: '/admin/access-manage' },
  { id: 'recruit', label: '採用情報', desc: '求人票', editHref: '/admin/recruit-manage' },
  { id: 'pricing', label: '料金プラン', desc: '料金プラン一覧', editHref: '/admin/pricing-manage' },
  { id: 'schedule', label: '1日の流れ', desc: '相談〜制作の流れ', editHref: '/admin/schedule-manage' },
  { id: 'availability', label: '空き情報', desc: '相談可能な日時', editHref: '/admin/availability-manage' },
  { id: 'faq', label: 'よくある質問', desc: 'FAQ', editHref: '/admin/faq-manage' },
  { id: 'cta', label: '相談CTA', desc: '問い合わせ誘導', editHref: '/admin/page-content', alwaysOn: true },
]
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sections, setSections] = useState({})
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=セクション設定`)
      const data = await res.json()
      const map = {}
      data.forEach(row => {
        map[row['セクションID']] = row['表示'] === true || row['表示'] === 'TRUE'
      })
      setSections(map)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }
  const toggleSection = async (sectionId, currentValue) => {
    setSaving(sectionId)
    const newValue = currentValue ? 'FALSE' : 'TRUE'
    try {
      await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateSection', sectionId, value: newValue }),
      })
      setSections(prev => ({ ...prev, [sectionId]: !currentValue }))
      if (process.env.NEXT_PUBLIC_DEPLOY_HOOK) {
        fetch(process.env.NEXT_PUBLIC_DEPLOY_HOOK, { method: 'POST' })
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(null)
  }
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '48px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a2744' }}>COCO<span style={{ color: '#b8954a' }}>&amp;</span>Bridge</div>
            <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>管理画面</div>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '6px', padding: '10px 14px', color: '#cc0000', fontSize: '13px' }}>{error}</div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '6px' }}>パスワード</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="パスワードを入力"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '15px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ background: '#1a2744', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              ログイン
            </button>
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
  return (
    <AdminLayout current="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>ダッシュボード</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>各セクションの表示ON/OFFと編集ができます</p>
        </div>
        <a href="https://coco-bridge.com" target="_blank" rel="noreferrer"
          style={{ background: '#1a2744', color: 'white', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
          🌐 サイトを確認
        </a>
      </div>
      <div style={{ display: 'grid', gap: '12px' }}>
        {SECTION_CONFIG.map(section => {
          const isOn = section.alwaysOn || sections[section.id]
          const isSaving = saving === section.id
          return (
            <div key={section.id} style={{ background: 'white', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', opacity: isOn ? 1 : 0.65 }}>
              <div style={{ flexShrink: 0 }}>
                {section.alwaysOn ? (
                  <div style={{ width: '48px', height: '26px', borderRadius: '13px', background: '#b8954a', position: 'relative', opacity: 0.5 }}>
                    <div style={{ position: 'absolute', top: '3px', left: '25px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                ) : (
                  <button
                    onClick={() => toggleSection(section.id, sections[section.id])}
                    disabled={isSaving}
                    style={{ width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: isOn ? '#b8954a' : '#ddd', position: 'relative', transition: 'background 0.2s', opacity: isSaving ? 0.6 : 1 }}
                  >
                    <div style={{ position: 'absolute', top: '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', left: isOn ? '25px' : '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </button>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a2744', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {section.label}
                  {section.alwaysOn && <span style={{ fontSize: '11px', color: '#999', fontWeight: '400' }}>常時表示</span>}
                  {!section.alwaysOn && <span style={{ fontSize: '11px', color: isOn ? '#b8954a' : '#bbb', fontWeight: '400' }}>{isOn ? '表示中' : '非表示'}</span>}
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{section.desc}</div>
              </div>
              <a
                href={section.editHref}
                style={{ background: isOn ? '#f0f0f0' : '#f8f8f8', color: '#444', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', fontWeight: '500', whiteSpace: 'nowrap' }}
              >
                編集 →
              </a>
            </div>
          )
        })}
      </div>
    </AdminLayout>
  )
}
