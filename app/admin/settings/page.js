'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const COLOR_PRESETS = [
  { name: 'ネイビー×ゴールド（デフォルト）', primary: '#1a2744', accent: '#b8954a' },
  { name: 'ディープグリーン×ゴールド', primary: '#1a3a2a', accent: '#c9a84c' },
  { name: 'チャコール×テラコッタ', primary: '#2c2c2c', accent: '#c4704a' },
  { name: 'ミッドナイトブルー×シルバー', primary: '#1a1f3c', accent: '#8899aa' },
]

const SITE_FIELDS = [
  { key: 'site_name', label: 'サイト名', type: 'text' },
  { key: 'site_tagline', label: 'タグライン', type: 'text' },
  { key: 'contact_email', label: '通知メールアドレス', type: 'email' },
  { key: 'contact_phone', label: '電話番号', type: 'text' },
  { key: 'footer_text', label: 'フッターテキスト', type: 'text' },
]

export default function SettingsPage() {
  const [values, setValues] = useState({})
  const [original, setOriginal] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(null)

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

  const applyPreset = (preset) => {
    setSelectedPreset(preset.name)
    setValues(prev => ({ ...prev, color_primary: preset.primary, color_accent: preset.accent }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const changed = {}
      const allKeys = [...SITE_FIELDS.map(f => f.key), 'color_primary', 'color_accent']
      allKeys.forEach(key => {
        if (values[key] !== original[key]) changed[key] = values[key]
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

  const isDirty = [...SITE_FIELDS.map(f => f.key), 'color_primary', 'color_accent'].some(
    key => values[key] !== original[key]
  )

  return (
    <AdminLayout current="settings">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>基本設定</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>サイト情報とカラーテーマを設定します</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          style={{
            background: isDirty ? '#b8954a' : '#ccc', color: 'white', border: 'none',
            padding: '10px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600',
            cursor: isDirty ? 'pointer' : 'default',
          }}
        >
          {saving ? '保存中...' : saved ? '✓ 保存しました' : '変更を保存'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>読み込み中...</div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1a2744', marginBottom: '20px' }}>サイト情報</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {SITE_FIELDS.map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '6px' }}>
                    {field.label}
                    {values[field.key] !== original[field.key] && (
                      <span style={{ marginLeft: '8px', fontSize: '11px', color: '#b8954a', fontWeight: '400' }}>変更あり</span>
                    )}
                  </label>
                  <input
                    type={field.type}
                    value={values[field.key] || ''}
                    onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1a2744', marginBottom: '8px' }}>カラーテーマ</h2>
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>プリセットを選ぶか、カスタムカラーを指定できます</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  style={{
                    border: selectedPreset === preset.name || (values.color_primary === preset.primary && values.color_accent === preset.accent) ? '2px solid #b8954a' : '2px solid #e0e0e0',
                    borderRadius: '8px', padding: '12px', background: 'white', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: preset.primary }} />
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: preset.accent }} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a2744' }}>{preset.name}</div>
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '6px' }}>
                  プライマリカラー
                  {values.color_primary !== original.color_primary && (
                    <span style={{ marginLeft: '8px', fontSize: '11px', color: '#b8954a', fontWeight: '400' }}>変更あり</span>
                  )}
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={values.color_primary || '#1a2744'}
                    onChange={e => { setValues(prev => ({ ...prev, color_primary: e.target.value })); setSelectedPreset(null) }}
                    style={{ width: '48px', height: '40px', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer', padding: '2px' }}
                  />
                  <input
                    type="text"
                    value={values.color_primary || '#1a2744'}
                    onChange={e => { setValues(prev => ({ ...prev, color_primary: e.target.value })); setSelectedPreset(null) }}
                    style={{ flex: 1, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '6px' }}>
                  アクセントカラー
                  {values.color_accent !== original.color_accent && (
                    <span style={{ marginLeft: '8px', fontSize: '11px', color: '#b8954a', fontWeight: '400' }}>変更あり</span>
                  )}
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={values.color_accent || '#b8954a'}
                    onChange={e => { setValues(prev => ({ ...prev, color_accent: e.target.value })); setSelectedPreset(null) }}
                    style={{ width: '48px', height: '40px', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer', padding: '2px' }}
                  />
                  <input
                    type="text"
                    value={values.color_accent || '#b8954a'}
                    onChange={e => { setValues(prev => ({ ...prev, color_accent: e.target.value })); setSelectedPreset(null) }}
                    style={{ flex: 1, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '20px', borderRadius: '8px', background: values.color_primary || '#1a2744' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>プレビュー</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>カラーテーマのプレビュー</div>
              <button style={{ background: values.color_accent || '#b8954a', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                CTAボタン
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
