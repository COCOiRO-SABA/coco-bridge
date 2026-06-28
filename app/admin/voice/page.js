'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

export default function VoicePage() {
  const [authed, setAuthed] = useState(false)
  const [voices, setVoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [saved, setSaved] = useState(null)
  const [adding, setAdding] = useState(false)
  const [addSaving, setAddSaving] = useState(false)
  const [newVoice, setNewVoice] = useState({ '会社名': '', '担当者名': '', 'コメント': '', '画像URL': '', '表示順': '', '公開': 'TRUE' })

  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === 'true') {
      setAuthed(true)
      loadData()
    } else {
      window.location.href = '/admin'
    }
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=お客様の声`)
      const json = await res.json()
      const rows = Array.isArray(json) ? json : (json.data || [])
      setVoices(rows)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function handleSave(i, voice) {
    setSaving(i)
    try {
      await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateRow', sheet: 'お客様の声', rowIndex: i + 2, data: voice }),
      })
      setSaved(i)
      setTimeout(() => setSaved(null), 2000)
    } catch (e) {
      console.error(e)
    }
    setSaving(null)
  }

  async function handleAdd() {
    setAddSaving(true)
    try {
      await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addRow', sheet: 'お客様の声', data: newVoice }),
      })
      setAdding(false)
      setNewVoice({ '会社名': '', '担当者名': '', 'コメント': '', '画像URL': '', '表示順': '', '公開': 'TRUE' })
      await loadData()
    } catch (e) {
      console.error(e)
    }
    setAddSaving(false)
  }

  function updateField(i, key, val) {
    setVoices(prev => prev.map((v, idx) => idx === i ? { ...v, [key]: val } : v))
  }

  if (!authed) return null

  const FIELDS = [
    { key: '会社名', label: '会社名', type: 'text' },
    { key: '担当者名', label: '担当者名', type: 'text' },
    { key: 'コメント', label: 'コメント', type: 'textarea' },
    { key: '画像URL', label: '画像URL', type: 'text' },
    { key: '表示順', label: '表示順', type: 'text' },
  ]

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>お客様の声</h1>
          <button onClick={() => setAdding(true)}
            style={{ background: '#1a2744', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
            ＋ 追加
          </button>
        </div>

        {adding && (
          <div style={{ background: '#fff', border: '2px solid #1a2744', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>新規追加</h2>
            {FIELDS.map(f => (
              <div key={f.key} style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea value={newVoice[f.key]} onChange={e => setNewVoice(p => ({ ...p, [f.key]: e.target.value }))} rows={3}
                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
                ) : (
                  <input type="text" value={newVoice[f.key]} onChange={e => setNewVoice(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' }} />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleAdd} disabled={addSaving}
                style={{ background: '#1a2744', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', cursor: 'pointer', fontWeight: '600', opacity: addSaving ? 0.6 : 1 }}>
                {addSaving ? '保存中...' : '追加する'}
              </button>
              <button onClick={() => setAdding(false)}
                style={{ background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', cursor: 'pointer' }}>
                キャンセル
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>読み込み中...</div>
        ) : voices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
            お客様の声がありません
          </div>
        ) : (
          voices.map((voice, i) => {
            const isPublic = voice['公開'] === 'TRUE' || voice['公開'] === true
            return (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>{voice['会社名'] || '（会社名なし）'} {voice['担当者名'] ? `/ ${voice['担当者名']}` : ''}</span>
                  <button
                    onClick={() => updateField(i, '公開', isPublic ? 'FALSE' : 'TRUE')}
                    style={{
                      background: isPublic ? '#e6f4ea' : '#fce8e6',
                      color: isPublic ? '#1e7e34' : '#c0392b',
                      border: 'none', borderRadius: '20px', padding: '5px 16px', fontSize: '12px', cursor: 'pointer', fontWeight: '600'
                    }}>
                    {isPublic ? '公開中' : '非公開'}
                  </button>
                </div>
                {FIELDS.map(f => (
                  <div key={f.key} style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#999', marginBottom: '3px' }}>{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea value={voice[f.key] || ''} onChange={e => updateField(i, f.key, e.target.value)} rows={3}
                        style={{ width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '7px 11px', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }} />
                    ) : (
                      <input type="text" value={voice[f.key] || ''} onChange={e => updateField(i, f.key, e.target.value)}
                        style={{ width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '7px 11px', fontSize: '13px', boxSizing: 'border-box' }} />
                    )}
                  </div>
                ))}
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => handleSave(i, voice)} disabled={saving === i}
                    style={{ background: '#1a2744', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 22px', fontSize: '13px', cursor: 'pointer', fontWeight: '600', opacity: saving === i ? 0.6 : 1 }}>
                    {saving === i ? '保存中...' : '保存する'}
                  </button>
                  {saved === i && <span style={{ color: '#1e7e34', fontSize: '13px', fontWeight: '600' }}>✓ 保存しました</span>}
                </div>
              </div>
            )
          })
        )}
      </div>
    </AdminLayout>
  )
}
