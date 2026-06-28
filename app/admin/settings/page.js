'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const COLOR_PRESETS = [
  { name: 'ネイビー×ゴールド（デフォルト）', color_main: '#1a2744', accent: '#b8954a' },
  { name: 'ディープグリーン×ゴールド', color_main: '#1a3a2a', accent: '#c9a84c' },
  { name: 'チャコール×テラコッタ', color_main: '#2c2c2c', accent: '#c4704a' },
  { name: 'ミッドナイトブルー×シルバー', color_main: '#1a1f3c', accent: '#8899aa' },
]

const SITE_FIELDS = [
  { key: 'site_name', label: 'サイト名', type: 'text' },
  { key: 'contact_email', label: '通知メールアドレス', type: 'email' },
  { key: 'reply_days', label: '問い合わせ返信目安', type: 'text' },
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
      const obj = {}
      rows.forEach(row => { obj[row['項目キー']] = row['値'] })
      setValues(obj)
      setOriginal(obj)
    } catch (e) {
      console.error('設定の読み込みに失敗しました:', e)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'update', sheet: 'サイト全体設定', data: values }),
      })
      const result = await res.json()
      if (result.success) {
        setOriginal(values)
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

  const applyPreset = (preset) => {
    setSelectedPreset(preset.name)
    setValues(prev => ({ ...prev, color_main: preset.color_main, accent: preset.accent }))
  }

  const isDirty = JSON.stringify(values) !== JSON.stringify(original)

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-600)' }}>読み込み中...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ padding: '32px', maxWidth: '720px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--navy)', marginBottom: '8px' }}>サイト設定</h1>
        <p style={{ color: 'var(--gray-600)', marginBottom: '32px', fontSize: '14px' }}>サイト全体の基本設定を管理します</p>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(26,39,68,0.07)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--navy)', marginBottom: '20px' }}>基本情報</h2>
          {SITE_FIELDS.map(field => (
            <div key={field.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '6px' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                value={values[field.key] || ''}
                onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1.5px solid var(--gray-200)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(26,39,68,0.07)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--navy)', marginBottom: '8px' }}>カラーテーマ</h2>
          <p style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '20px' }}>プリセットを選択するか、直接カラーコードを入力してください</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {COLOR_PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                style={{
                  padding: '12px 16px',
                  border: selectedPreset === preset.name ? '2px solid var(--navy)' : '1.5px solid var(--gray-200)',
                  borderRadius: '10px',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--navy)',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: preset.color_main }} />
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: preset.accent }} />
                </div>
                {preset.name}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '6px' }}>
                メインカラー
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={values.color_main || '#1a2744'}
                  onChange={e => { setValues(prev => ({ ...prev, color_main: e.target.value })); setSelectedPreset(null) }}
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={values.color_main || '#1a2744'}
                  onChange={e => { setValues(prev => ({ ...prev, color_main: e.target.value })); setSelectedPreset(null) }}
                  style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '6px' }}>
                アクセントカラー
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={values.accent || '#b8954a'}
                  onChange={e => { setValues(prev => ({ ...prev, accent: e.target.value })); setSelectedPreset(null) }}
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={values.accent || '#b8954a'}
                  onChange={e => { setValues(prev => ({ ...prev, accent: e.target.value })); setSelectedPreset(null) }}
                  style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            style={{
              padding: '12px 32px',
              background: isDirty ? 'var(--navy)' : 'var(--gray-300)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isDirty ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            {saving ? '保存中...' : '設定を保存'}
          </button>
          {saved && (
            <span style={{ color: '#16a34a', fontSize: '14px', fontWeight: '600' }}>✓ 保存しました</span>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
