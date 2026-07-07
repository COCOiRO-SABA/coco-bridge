'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const SHEET = '料金表'
const GAS_API = process.env.NEXT_PUBLIC_GAS_API

export default function PricingManage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [newItem, setNewItem] = useState({ 'プラン名': '', '説明': '', '金額': '', 'おすすめ': 'FALSE', '表示順': '', '公開': 'TRUE' })

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
    const res = await fetch(`${GAS_API}?sheet=${encodeURIComponent(SHEET)}`, { cache: 'no-store' })
    const data = await res.json()
    setItems(data.sort((a, b) => (a['表示順'] || 0) - (b['表示順'] || 0)))
    setLoading(false)
  }

  const handleSave = async (item, index) => {
    setSaving(index)
    await fetch(GAS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateRow', sheet: SHEET, rowIndex: index + 2, data: item }),
    })
    setSaving(null)
  }

  const handleAdd = async () => {
    if (!newItem['プラン名']) return
    setSaving('new')
    await fetch(GAS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addRow', sheet: SHEET, data: newItem }),
    })
    setNewItem({ 'プラン名': '', '説明': '', '金額': '', 'おすすめ': 'FALSE', '表示順': '', '公開': 'TRUE' })
    await loadData()
    setSaving(null)
  }

  const handleChange = (index, key, value) => {
    const updated = [...items]
    updated[index][key] = value
    setItems(updated)
  }

  if (!authed) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 20px rgba(0,0,0,0.1)', width: '320px' }}>
          <h2 style={{ marginBottom: '24px', color: '#1a2744', textAlign: 'center' }}>管理者ログイン</h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="パスワード" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', boxSizing: 'border-box' }} />
          {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#1a2744', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>ログイン</button>
        </form>
      </div>
    )
  }

  return (
    <AdminLayout>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '24px' }}>料金プラン 管理</h1>
      {loading ? <p>読み込み中...</p> : (
        <>
          <div style={{ marginBottom: '32px' }}>
            {items.map((item, index) => (
              <div key={index} style={{ background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>プラン名</label>
                      <input value={item['プラン名'] || ''} onChange={e => handleChange(index, 'プラン名', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>金額</label>
                      <input value={item['金額'] || ''} onChange={e => handleChange(index, '金額', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>説明</label>
                    <textarea value={item['説明'] || ''} onChange={e => handleChange(index, '説明', e.target.value)} rows={3} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>おすすめ</label>
                      <select value={item['おすすめ'] || 'FALSE'} onChange={e => handleChange(index, 'おすすめ', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}>
                        <option value="TRUE">おすすめ</option>
                        <option value="FALSE">なし</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>表示順</label>
                      <input type="number" value={item['表示順'] || ''} onChange={e => handleChange(index, '表示順', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>公開</label>
                      <select value={item['公開'] || 'TRUE'} onChange={e => handleChange(index, '公開', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}>
                        <option value="TRUE">公開</option>
                        <option value="FALSE">非公開</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', textAlign: 'right' }}>
                  <button onClick={() => handleSave(item, index)} disabled={saving === index} style={{ padding: '8px 20px', background: '#1a2744', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    {saving === index ? '保存中...' : '保存'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a2744', marginBottom: '16px' }}>新規追加</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>プラン名</label>
                  <input value={newItem['プラン名']} onChange={e => setNewItem({ ...newItem, 'プラン名': e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>金額</label>
                  <input value={newItem['金額']} onChange={e => setNewItem({ ...newItem, '金額': e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>説明</label>
                <textarea value={newItem['説明']} onChange={e => setNewItem({ ...newItem, '説明': e.target.value })} rows={3} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>おすすめ</label>
                  <select value={newItem['おすすめ']} onChange={e => setNewItem({ ...newItem, 'おすすめ': e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}>
                    <option value="TRUE">おすすめ</option>
                    <option value="FALSE">なし</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>表示順</label>
                  <input type="number" value={newItem['表示順']} onChange={e => setNewItem({ ...newItem, '表示順': e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>公開</label>
                  <select value={newItem['公開']} onChange={e => setNewItem({ ...newItem, '公開': e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}>
                    <option value="TRUE">公開</option>
                    <option value="FALSE">非公開</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <button onClick={handleAdd} disabled={saving === 'new'} style={{ padding: '10px 24px', background: '#b8954a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                {saving === 'new' ? '追加中...' : '＋ 追加'}
              </button>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
