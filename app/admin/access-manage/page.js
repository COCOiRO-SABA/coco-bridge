'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
const FIELDS = [
  { key: 'address', label: '住所', type: 'text' },
  { key: 'nearest_station', label: '最寄り駅', type: 'text' },
  { key: 'business_hours', label: '営業時間', type: 'text' },
  { key: 'parking', label: '駐車場', type: 'text' },
  { key: 'tel', label: '電話番号', type: 'text' },
  { key: 'map_url', label: 'Googleマップ埋め込みURL', type: 'text' },
]
export default function AccessManagePage() {
  const [data, setData] = useState({})
  const [original, setOriginal] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') !== 'true') { window.location.href = '/admin'; return }
    loadData()
  }, [])
  const loadData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=アクセス`)
    const rows = await res.json()
    const obj = {}
    rows.forEach(row => { obj[row['項目キー']] = row['値'] })
    setData(obj)
    setOriginal(obj)
    setLoading(false)
  }
  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'update', sheet: 'アクセス', data }),
      })
      const result = await res.json()
      if (result.success) {
        setOriginal({ ...data })
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
  const changed = FIELDS.some(f => data[f.key] !== original[f.key])
  if (loading) return <AdminLayout current="access"><div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>読み込み中...</div></AdminLayout>
  return (
    <AdminLayout current="access">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>アクセス情報</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>住所・地図・営業時間の編集</p>
        </div>
        <button onClick={handleSave} disabled={saving || !changed}
          style={{ background: saved ? '#27ae60' : changed ? '#b8954a' : '#ccc', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: changed ? 'pointer' : 'default' }}>
          {saving ? '保存中...' : saved ? '✅ 保存しました' : '変更を保存'}
        </button>
      </div>
      <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'grid', gap: '16px' }}>
          {FIELDS.map(f => (
            <div key={f.key}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '6px' }}>
                {f.label}
                {data[f.key] !== original[f.key] && <span style={{ fontSize: '11px', color: '#b8954a', fontWeight: '400' }}>変更あり</span>}
              </label>
              <input
                type="text"
                value={data[f.key] || ''}
                onChange={e => setData({ ...data, [f.key]: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#999', lineHeight: '1.7' }}>
            💡 GoogleマップのURLはGoogleマップで該当場所を開き、「共有」→「地図を埋め込む」から取得したiframeのsrc属性の値を貼り付けてください。
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
