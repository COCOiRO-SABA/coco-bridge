'use client'

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return String(value)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
export default function NewsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newPost, setNewPost] = useState({ タイトル: '', カテゴリ: 'お知らせ', 本文: '', 公開日: new Date().toISOString().split('T')[0], ステータス: '公開' })
  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') !== 'true') { window.location.href = '/admin'; return }
    loadData()
  }, [])
  const loadData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=お知らせ`)
    const data = await res.json()
    setPosts(data.map(p => ({ ...p, 公開日: formatDate(p['公開日']) })))
    setLoading(false)
  }
  const updatePost = (index, key, value) => {
    setPosts(prev => prev.map((p, i) => i === index ? { ...p, [key]: value } : p))
  }
  const handleSave = async () => {
    setSaving(true)
    for (let i = 0; i < posts.length; i++) {
      await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateRow', sheet: 'お知らせ', rowIndex: i + 2, data: posts[i] }),
      })
    }
    if (process.env.NEXT_PUBLIC_DEPLOY_HOOK) {
      await fetch(process.env.NEXT_PUBLIC_DEPLOY_HOOK, { method: 'POST' })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }
  const handleAdd = async () => {
    await fetch(process.env.NEXT_PUBLIC_GAS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'addRow', sheet: 'お知らせ', data: newPost }),
    })
    setNewPost({ タイトル: '', カテゴリ: 'お知らせ', 本文: '', 公開日: new Date().toLocaleDateString('ja-JP'), ステータス: '公開' })
    setAdding(false)
    loadData()
  }
  if (loading) return <AdminLayout current="news"><div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>読み込み中...</div></AdminLayout>
  return (
    <AdminLayout current="news">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>お知らせ管理</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>記事の追加・編集・公開設定</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setAdding(!adding)}
            style={{ background: '#1a2744', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            + 新規追加
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ background: saved ? '#27ae60' : '#b8954a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            {saving ? '保存中...' : saved ? '✅ 保存' : '変更を保存'}
          </button>
        </div>
      </div>
      {adding && (
        <div style={{ background: '#f0f7ff', border: '1px solid #b0d0ff', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a2744', marginBottom: '14px' }}>新規記事</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input placeholder="タイトル" value={newPost.タイトル} onChange={e => setNewPost({ ...newPost, タイトル: e.target.value })}
              style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select value={newPost.カテゴリ} onChange={e => setNewPost({ ...newPost, カテゴリ: e.target.value })}
                style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}>
                <option>お知らせ</option>
                <option>事例紹介</option>
                <option>コラム</option>
                <option>プレスリリース</option>
              </select>
              <input type="date" value={newPost.公開日} onChange={e => setNewPost({ ...newPost, 公開日: e.target.value })}
                style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <textarea rows={3} placeholder="本文" value={newPost.本文} onChange={e => setNewPost({ ...newPost, 本文: e.target.value })}
              style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleAdd} style={{ background: '#b8954a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>追加する</button>
              <button onClick={() => setAdding(false)} style={{ background: '#f0f0f0', color: '#444', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>キャンセル</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gap: '12px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999', background: 'white', borderRadius: '10px' }}>
            <p>まだ記事がありません。「新規追加」から作成してください。</p>
          </div>
        ) : posts.map((post, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#b8954a', background: 'rgba(184,149,74,0.1)', padding: '2px 10px', borderRadius: '20px' }}>{post['カテゴリ']}</span>
                <input type="date" value={post['公開日'] || ''} onChange={e => updatePost(i, '公開日', e.target.value)}
                  style={{ fontSize: '12px', color: '#999', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '2px 8px' }} />
              </div>
              <select value={post['ステータス'] || '公開'} onChange={e => updatePost(i, 'ステータス', e.target.value)}
                style={{ padding: '4px 10px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '12px', color: post['ステータス'] === '公開' ? '#27ae60' : '#999' }}>
                <option>公開</option>
                <option>下書き</option>
                <option>非公開</option>
              </select>
            </div>
            <input value={post['タイトル'] || ''} onChange={e => updatePost(i, 'タイトル', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '15px', fontWeight: '600', boxSizing: 'border-box', marginBottom: '8px' }} />
            <textarea rows={2} value={post['本文'] || ''} onChange={e => updatePost(i, '本文', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
