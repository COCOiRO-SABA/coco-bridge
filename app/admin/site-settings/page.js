'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
const colorPresets = [
  { label: 'ネイビー×ゴールド', main: '#1a2744', accent: '#b8954a' },
  { label: 'ダークグリーン×ゴールド', main: '#1a3a2a', accent: '#c9a84c' },
  { label: 'チャコール×テラコッタ', main: '#2c2c2c', accent: '#c4704a' },
  { label: 'ミッドナイト×シルバー', main: '#1a1f3c', accent: '#8899aa' },
]
export default function SiteSettingsPage() {
  const [config, setConfig] = useState({})
  const [original, setOriginal] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') !== 'true') { window.location.href = '/admin'; return }
    loadData()
  }, [])
  const loadData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=サイト全体設定`)
    const data = await res.json()
    const cfg = {}
    data.forEach(row => { cfg[row['項目キー']] = row['値'] })
    setConfig(cfg)
    setOriginal(cfg)
    setLoading(false)
  }
  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'update', sheet: 'サイト全体設定', data: config }),
      })
      const result = await res.json()
      if (result.success) {
        setOriginal({ ...config })
        if (process.env.NEXT_PUBLIC_DEPLOY_HOOK) {
          await fetch(process.env.NEXT_PUBLIC_DEPLOY_HOOK, { method: 'POST' })
        }
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('保存失敗: ' + JSON.stringify(result))
      }
    } catch (e) {
      alert('エラー: ' + e.message)
    }
    setSaving(false)
  }
  const changed = ['site_name', 'cta_text', 'cta_url', 'reply_days', 'contact_email', 'footer_text', 'color_main', 'color_accent'].some(k => config[k] !== original[k])
  if (loading) return <AdminLayout current="site-settings"><div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>読み込み中...</div></AdminLayout>
  return (
    <AdminLayout current="site-settings">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>サイト設定</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>サイト名・カラー・問い合わせ設定</p>
        </div>
        <button onClick={handleSave} disabled={saving || !changed}
          style={{ background: saved ? '#27ae60' : changed ? '#b8954a' : '#ccc', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: changed ? 'pointer' : 'default' }}>
          {saving ? '保存中...' : saved ? '✅ 保存しました' : '変更を保存'}
        </button>
      </div>
      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1a2744', marginBottom: '16px' }}>基本情報</h2>
          <div style={{ display: 'grid', gap: '14px' }}>
            {[
              { key: 'site_name', label: 'サイト名' },
              { key: 'footer_text', label: 'フッターテキスト' },
              { key: 'cta_text', label: 'CTAボタンテキスト' },
              { key: 'cta_url', label: 'CTAリンク先' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '6px' }}>
                  {f.label}
                  {config[f.key] !== original[f.key] && <span style={{ fontSize: '11px', color: '#b8954a', fontWeight: '400' }}>変更あり</span>}
                </label>
                <input type="text" value={config[f.key] || ''} onChange={e => setConfig({ ...config, [f.key]: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1a2744', marginBottom: '16px' }}>問い合わせ設定</h2>
          <div style={{ display: 'grid', gap: '14px' }}>
            {[
              { key: 'contact_email', label: '通知先メールアドレス' },
              { key: 'reply_days', label: '返信目安（例：2営業日）' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '6px' }}>
                  {f.label}
                  {config[f.key] !== original[f.key] && <span style={{ fontSize: '11px', color: '#b8954a', fontWeight: '400' }}>変更あり</span>}
                </label>
                <input type="text" value={config[f.key] || ''} onChange={e => setConfig({ ...config, [f.key]: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1a2744', marginBottom: '8px' }}>カラーテーマ</h2>
          <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>保存後1〜2分でサイトに反映されます</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {colorPresets.map((preset, i) => {
              const isSelected = config.color_main === preset.main && config.color_accent === preset.accent
              return (
                <button key={i} onClick={() => setConfig({ ...config, color_main: preset.main, color_accent: preset.accent })}
                  style={{ border: isSelected ? '2px solid #b8954a' : '2px solid #e0e0e0', borderRadius: '8px', padding: '12px', cursor: 'pointer', background: 'white', textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: preset.main }} />
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: preset.accent }} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#444', fontWeight: isSelected ? '700' : '400' }}>{preset.label}</div>
                </button>
              )
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {[
              { key: 'color_main', label: 'メインカラー' },
              { key: 'color_accent', label: 'アクセントカラー' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '6px' }}>
                  {f.label}
                  {config[f.key] !== original[f.key] && <span style={{ fontSize: '11px', color: '#b8954a', fontWeight: '400' }}>変更あり</span>}
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={config[f.key] || '#000000'} onChange={e => setConfig({ ...config, [f.key]: e.target.value })}
                    style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                  <input type="text" value={config[f.key] || ''} onChange={e => setConfig({ ...config, [f.key]: e.target.value })}
                    style={{ flex: 1, padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '20px', borderRadius: '8px', background: config.color_main || '#1a2744' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>プレビュー</div>
            <button style={{ background: config.color_accent || '#b8954a', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
              CTAボタン
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
