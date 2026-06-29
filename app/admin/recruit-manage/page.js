'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const EMPTY_JOB = {
  'タイトル': '',
  '職種': '',
  '雇用形態': '',
  '仕事内容': '',
  '給与': '',
  '勤務時間': '',
  '資格・経験': '',
  '公開': 'TRUE',
}

export default function RecruitManagePage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [saved, setSaved] = useState(null)
  const [adding, setAdding] = useState(false)
  const [addSaving, setAddSaving] = useState(false)
  const [newJob, setNewJob] = useState({ ...EMPTY_JOB })
  const [editIndex, setEditIndex] = useState(null)
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === 'true') {
      loadData()
    } else {
      window.location.href = '/admin'
    }
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=採用情報`)
      const json = await res.json()
      const rows = Array.isArray(json) ? json : []
      setJobs(rows)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function handleTogglePublish(index, current) {
    setSaving(index)
    try {
      const newVal = current === 'TRUE' ? 'FALSE' : 'TRUE'
      const updated = { ...jobs[index], '公開': newVal }
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateRow', sheet: '採用情報', rowIndex: index, data: updated }),
      })
      const result = await res.json()
      if (result.success) {
        const next = [...jobs]
        next[index] = updated
        setJobs(next)
        setSaved(index)
        setTimeout(() => setSaved(null), 2000)
      } else {
        alert('更新失敗: ' + JSON.stringify(result))
      }
    } catch (e) {
      alert('エラー: ' + e.message)
    }
    setSaving(null)
  }

  async function handleSaveEdit(index) {
    setSaving(index)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateRow', sheet: '採用情報', rowIndex: index, data: editData }),
      })
      const result = await res.json()
      if (result.success) {
        const next = [...jobs]
        next[index] = editData
        setJobs(next)
        setEditIndex(null)
        setEditData(null)
        setSaved(index)
        setTimeout(() => setSaved(null), 2000)
        if (process.env.NEXT_PUBLIC_DEPLOY_HOOK) {
          await fetch(process.env.NEXT_PUBLIC_DEPLOY_HOOK, { method: 'POST' })
        }
      } else {
        alert('保存失敗: ' + JSON.stringify(result))
      }
    } catch (e) {
      alert('エラー: ' + e.message)
    }
    setSaving(null)
  }

  async function handleAdd() {
    setAddSaving(true)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'addRow', sheet: '採用情報', row: newJob }),
      })
      const result = await res.json()
      if (result.success) {
        await loadData()
        setNewJob({ ...EMPTY_JOB })
        setAdding(false)
        if (process.env.NEXT_PUBLIC_DEPLOY_HOOK) {
          await fetch(process.env.NEXT_PUBLIC_DEPLOY_HOOK, { method: 'POST' })
        }
      } else {
        alert('追加失敗: ' + JSON.stringify(result))
      }
    } catch (e) {
      alert('エラー: ' + e.message)
    }
    setAddSaving(false)
  }

  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }
  const textareaStyle = { ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }

  if (loading) return (
    <AdminLayout current="recruit">
      <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>読み込み中...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout current="recruit">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>採用管理</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>求人情報の追加・編集・公開設定</p>
        </div>
        <button
          onClick={() => { setAdding(true); setNewJob({ ...EMPTY_JOB }) }}
          style={{ background: '#1a2744', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
        >
          ＋ 求人を追加
        </button>
      </div>

      {adding && (
        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px', border: '2px solid #b8954a' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1a2744', marginBottom: '16px' }}>新規求人を追加</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { key: 'タイトル', label: 'タイトル（例：ITサポートスタッフ募集）' },
              { key: '職種', label: '職種' },
              { key: '雇用形態', label: '雇用形態（例：正社員・パート）' },
              { key: '給与', label: '給与' },
              { key: '勤務時間', label: '勤務時間' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>{f.label}</label>
                <input
                  type="text"
                  value={newJob[f.key] || ''}
                  onChange={e => setNewJob({ ...newJob, [f.key]: e.target.value })}
                  style={inputStyle}
                />
              </div>
            ))}
            {[
              { key: '仕事内容', label: '仕事内容' },
              { key: '資格・経験', label: '資格・経験（任意）' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>{f.label}</label>
                <textarea
                  value={newJob[f.key] || ''}
                  onChange={e => setNewJob({ ...newJob, [f.key]: e.target.value })}
                  style={textareaStyle}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>公開設定</label>
              <select
                value={newJob['公開']}
                onChange={e => setNewJob({ ...newJob, '公開': e.target.value })}
                style={{ ...inputStyle, width: 'auto' }}
              >
                <option value="TRUE">公開</option>
                <option value="FALSE">非公開</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={handleAdd}
              disabled={addSaving || !newJob['タイトル']}
              style={{ background: addSaving ? '#999' : '#b8954a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              {addSaving ? '追加中...' : '追加する'}
            </button>
            <button
              onClick={() => setAdding(false)}
              style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '10px', padding: '48px', textAlign: 'center', color: '#999', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          求人情報はまだありません。「求人を追加」から登録してください。
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {jobs.map((job, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: editIndex === i ? '2px solid #b8954a' : '1px solid transparent' }}>
              {editIndex === i ? (
                <div>
                  <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
                    {[
                      { key: 'タイトル', label: 'タイトル' },
                      { key: '職種', label: '職種' },
                      { key: '雇用形態', label: '雇用形態' },
                      { key: '給与', label: '給与' },
                      { key: '勤務時間', label: '勤務時間' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#666', marginBottom: '3px' }}>{f.label}</label>
                        <input
                          type="text"
                          value={editData[f.key] || ''}
                          onChange={e => setEditData({ ...editData, [f.key]: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                    ))}
                    {[
                      { key: '仕事内容', label: '仕事内容' },
                      { key: '資格・経験', label: '資格・経験' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#666', marginBottom: '3px' }}>{f.label}</label>
                        <textarea
                          value={editData[f.key] || ''}
                          onChange={e => setEditData({ ...editData, [f.key]: e.target.value })}
                          style={textareaStyle}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#666', marginBottom: '3px' }}>公開設定</label>
                      <select
                        value={editData['公開'] || 'TRUE'}
                        onChange={e => setEditData({ ...editData, '公開': e.target.value })}
                        style={{ ...inputStyle, width: 'auto' }}
                      >
                        <option value="TRUE">公開</option>
                        <option value="FALSE">非公開</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleSaveEdit(i)}
                      disabled={saving === i}
                      style={{ background: saving === i ? '#999' : '#b8954a', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      {saving === i ? '保存中...' : saved === i ? '✅ 保存済' : '保存'}
                    </button>
                    <button
                      onClick={() => { setEditIndex(null); setEditData(null) }}
                      style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a2744', margin: 0 }}>
                          {job['タイトル'] || '（タイトルなし）'}
                        </h3>
                        <span style={{
                          background: job['公開'] === 'TRUE' ? '#e8f5e9' : '#fafafa',
                          color: job['公開'] === 'TRUE' ? '#27ae60' : '#999',
                          border: `1px solid ${job['公開'] === 'TRUE' ? '#c8e6c9' : '#e0e0e0'}`,
                          borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '600'
                        }}>
                          {job['公開'] === 'TRUE' ? '公開中' : '非公開'}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '6px', marginBottom: '8px' }}>
                        {job['職種'] && <span style={{ fontSize: '13px', color: '#555' }}>📋 {job['職種']}</span>}
                        {job['雇用形態'] && <span style={{ fontSize: '13px', color: '#555' }}>👔 {job['雇用形態']}</span>}
                        {job['給与'] && <span style={{ fontSize: '13px', color: '#555' }}>💴 {job['給与']}</span>}
                        {job['勤務時間'] && <span style={{ fontSize: '13px', color: '#555' }}>🕐 {job['勤務時間']}</span>}
                      </div>
                      {job['仕事内容'] && (
                        <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                          {job['仕事内容'].slice(0, 120)}{job['仕事内容'].length > 120 ? '…' : ''}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleTogglePublish(i, job['公開'])}
                        disabled={saving === i}
                        style={{
                          background: job['公開'] === 'TRUE' ? '#fff3cd' : '#e8f5e9',
                          color: job['公開'] === 'TRUE' ? '#856404' : '#27ae60',
                          border: `1px solid ${job['公開'] === 'TRUE' ? '#ffc107' : '#c8e6c9'}`,
                          padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                        }}
                      >
                        {saving === i ? '…' : job['公開'] === 'TRUE' ? '非公開にする' : '公開する'}
                      </button>
                      <button
                        onClick={() => { setEditIndex(i); setEditData({ ...job }) }}
                        style={{ background: '#f8f9fa', color: '#333', border: '1px solid #ddd', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        編集
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
