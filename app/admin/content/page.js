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
  const [config, setConfig] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=サイト全体設定`)
      .then(r => r.json())
      .then(data => {
        const obj = {}
        data.forEach(row => { obj[row['項目キー']] = row['値'] })
        setConfig(obj)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('送信データ:', JSON.stringify({ action: 'update', sheet: 'サイト全体設定', data: config }))
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'update', sheet: 'サイト全体設定', data: config }),
      })
      const result = await res.json()
      console.log('保存結果:', result)
      if (result.success) {
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

  return (
    <AdminLayout current="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>コンテンツ編集</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>サイトに表示するテキストを編集できます</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saved ? '#22c55e' : '#1a2744',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            transition: 'background 0.3s',
          }}
        >
          {saving ? '保存中...' : saved ? '保存しました ✓' : '保存する'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {FIELDS.map(field => (
          <div key={field.key} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 6px rgba(26,39,68,0.06)' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a2744', marginBottom: '8px' }}>
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={config[field.key] || ''}
                onChange={e => setConfig({ ...config, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                rows={4}
                style={{
                  width: '100%',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#374151',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            ) : (
              <input
                type="text"
                value={config[field.key] || ''}
                onChange={e => setConfig({ ...config, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#374151',
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
