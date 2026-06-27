'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const FIELDS = [
  { key: 'catch_copy', label: 'キャッチコピー', type: 'text', placeholder: 'メインビジュアルの大見出し' },
  { key: 'sub_copy', label: 'サブコピー', type: 'textarea', placeholder: 'キャッチコピーの補足テキスト' },
  { key: 'cta_text', label: 'CTAボタンテキスト', type: 'text', placeholder: '例: お問い合わせはこちら' },
  { key: 'cta_url', label: 'CTAボタンリンク先', type: 'text', placeholder: '/contact' },
  { key: 'about_title', label: '「私たちについて」見出し', type: 'text', placeholder: '' },
  { key: 'about_text', label: '「私たちについて」本文', type: 'textarea', placeholder: '' },
  { key: 'profile_name', label: 'プロフィール名前', type: 'text', placeholder: '例: 田中 太郎' },
  { key: 'profile_title', label: 'プロフィール役職', type: 'text', placeholder: '例: 代表取締役' },
  { key: 'profile_bio', label: 'プロフィール紹介文', type: 'textarea', placeholder: '' },
]

export default function ContentPage() {
  const [values, setValues] = useState({})
  const [original, setOriginal] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API + '?sheet=サイト全体設定')
      const rows = await res.json()
      const cfg = {}
      rows.forEach(row => { cfg[row['項目キー']] = row['値'] })
      setValues(cfg)
      setOriginal(cfg)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const changed = {}
      FIELDS.forEach(f => {
        if (values[f.key] !== original[f.key]) changed[f.key] = values[f.key]
      })
      if (Object.keys(changed).length > 0) {
        await fetch(process.env.NEXT_PUBLIC_GAS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ sheet: 'サイト全体設定', action: 'update', data: changed }),
        })
        setOriginal({ ...values })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const isDirty = FIELDS.some(f => values[f.key] !== original[f.key])

  return (
    <AdminLayout current="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>コンテンツ編集</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>サイトに表示するテキストを編集できます</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          style={{
            background: isDirty ? '#b8954a' : '#ccc', color: 'white', border: 'none',
            padding: '10px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600',
            cursor: isDirty ? 'pointer' : 'default', transition: 'background 0.2s',
          }}
        >
          {saving ? '保存中...' : saved ? '✓ 保存しました' : '変更を保存'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>読み込み中...</div>
      ) : (
        <div style={{ background: 'white', borderRadius: '10px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'grid', gap: '24px' }}>
          {FIELDS.map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '8px' }}>
                {field.label}
                {values[field.key] !== original[field.key] && (
                  <span style={{ marginLeft: '8px', fontSize: '11px', color: '#b8954a', fontWeight: '400' }}>変更あり</span>
                )}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={values[field.key] || ''}
                  onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={4}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              ) : (
                <input
                  type="text"
                  value={values[field.key] || ''}
                  onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
