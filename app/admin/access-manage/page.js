'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
const FIELDS = [
  {
    section: '基本情報',
    fields: [
      { key: 'address', label: '住所', type: 'textarea', note: '改行可能。「〒000-0000 東京都〇〇区...」' },
      { key: 'tel', label: '電話番号', type: 'text' },
      { key: 'fax', label: 'FAX番号', type: 'text' },
      { key: 'email', label: 'メールアドレス', type: 'text' },
    ]
  },
  {
    section: 'アクセス情報',
    fields: [
      { key: 'nearest_station', label: '最寄り駅', type: 'text' },
      { key: 'business_hours', label: '営業時間', type: 'text' },
      { key: 'parking', label: '駐車場', type: 'text' },
      { key: 'access_note', label: 'アクセス方法・補足', type: 'textarea' },
    ]
  },
  {
    section: '表示設定',
    fields: [
      { key: 'show_station', label: '最寄り駅を表示する', type: 'toggle' },
      { key: 'show_hours', label: '営業時間を表示する', type: 'toggle' },
      { key: 'show_parking', label: '駐車場を表示する', type: 'toggle' },
    ]
  },
  {
    section: 'メッセージ',
    fields: [
      { key: 'visit_message', label: '来訪案内メッセージ', type: 'textarea', note: '例：ご来社の際は事前にご連絡いただけるとスムーズです。' },
      { key: 'hero_message', label: 'ページ説明文', type: 'text' },
    ]
  },
  {
    section: '地図',
    fields: [
      { key: 'map_url', label: 'Googleマップ埋め込みコード', type: 'textarea', note: 'Googleマップ「共有」→「地図を埋め込む」のiframeタグをそのまま貼り付けてください' },
    ]
  },
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
  const allKeys = FIELDS.flatMap(s => s.fields.map(f => f.key))
  const changed = allKeys.some(k => data[k] !== original[k])
  if (loading) return (
    <AdminLayout current="access">
      <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>読み込み中...</div>
    </AdminLayout>
  )
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
      <div style={{ display: 'grid', gap: '16px' }}>
        {FIELDS.map(section => (
          <div key={section.section} style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1a2744', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
              {section.section}
            </h2>
            <div style={{ display: 'grid', gap: '14px' }}>
              {section.fields.map(f => (
                <div key={f.key}>
                  {f.type === 'toggle' ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#1a2744' }}>{f.label}</label>
                      <button
                        onClick={() => setData({ ...data, [f.key]: (data[f.key] === 'FALSE') ? 'TRUE' : 'FALSE' })}
                        style={{
                          width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer',
                          background: data[f.key] !== 'FALSE' ? '#b8954a' : '#ddd',
                          position: 'relative', transition: 'background 0.2s',
                        }}
                      >
                        <div style={{
                          position: 'absolute', top: '3px', width: '20px', height: '20px',
                          borderRadius: '50%', background: 'white', transition: 'left 0.2s',
                          left: data[f.key] !== 'FALSE' ? '25px' : '3px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '6px' }}>
                        {f.label}
                        {data[f.key] !== original[f.key] && <span style={{ fontSize: '11px', color: '#b8954a', fontWeight: '400' }}>変更あり</span>}
                      </label>
                      {f.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={data[f.key] || ''}
                          onChange={e => setData({ ...data, [f.key]: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.6' }}
                        />
                      ) : (
                        <input type="text" value={data[f.key] || ''} onChange={e => setData({ ...data, [f.key]: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                      )}
                      {f.note && <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{f.note}</p>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
