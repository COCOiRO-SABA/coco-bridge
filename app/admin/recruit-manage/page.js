'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const EMPTY_JOB = {
  'è·ç¨®å': '',
  'éç¨å½¢æ': 'æ¥­åå§è¨',
  'æ¥­ååå®¹': '',
  'å¿åæ¡ä»¶': '',
  'çµ¦ä¸': 'è¦ç¸è«',
  'å¤åå°': '',
  'å¬é': 'TRUE',
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=æ¡ç¨æå ±`)
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
      const updated = { ...jobs[index], 'å¬é': newVal }
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateRow', sheet: 'æ¡ç¨æå ±', rowIndex: index + 2, data: updated }),
      })
      const result = await res.json()
      if (result.success) {
        const next = [...jobs]
        next[index] = updated
        setJobs(next)
        setSaved(index)
        setTimeout(() => setSaved(null), 2000)
      } else {
        alert('æ´æ°å¤±æ: ' + JSON.stringify(result))
      }
    } catch (e) {
      alert('ã¨ã©ã¼: ' + e.message)
    }
    setSaving(null)
  }

  async function handleSaveEdit(index) {
    setSaving(index)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateRow', sheet: 'æ¡ç¨æå ±', rowIndex: index + 2, data: editData }),
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
        alert('ä¿å­å¤±æ: ' + JSON.stringify(result))
      }
    } catch (e) {
      alert('ã¨ã©ã¼: ' + e.message)
    }
    setSaving(null)
  }

  async function handleAdd() {
    if (!newJob['è·ç¨®å']) {
      alert('è·ç¨®åãå¥åãã¦ãã ãã')
      return
    }
    setAddSaving(true)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'addRow', sheet: 'æ¡ç¨æå ±', data: newJob }),
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
        alert('è¿½å å¤±æ: ' + JSON.stringify(result))
      }
    } catch (e) {
      alert('ã¨ã©ã¼: ' + e.message)
    }
    setAddSaving(false)
  }

  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }
  const textareaStyle = { ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }

  if (loading) return (
    <AdminLayout current="recruit">
      <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>èª­ã¿è¾¼ã¿ä¸­...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout current="recruit">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>æ¡ç¨ç®¡ç</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>æ±äººæå ±ã®è¿½å ã»ç·¨éã»å¬éè¨­å®</p>
        </div>
        <button
          onClick={() => { setAdding(true); setNewJob({ ...EMPTY_JOB }) }}
          style={{ background: '#1a2744', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
        >
          ï¼ æ±äººãè¿½å 
        </button>
      </div>

      {adding && (
        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px', border: '2px solid #b8954a' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1a2744', marginBottom: '16px' }}>æ°è¦æ±äººãè¿½å </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { key: 'è·ç¨®å', label: 'è·ç¨®åï¼ä¾ï¼ITãµãã¼ãã¹ã¿ããï¼' },
              { key: 'éç¨å½¢æ', label: 'éç¨å½¢æï¼ä¾ï¼æ­£ç¤¾å¡ã»æ¥­åå§è¨ï¼' },
              { key: 'çµ¦ä¸', label: 'çµ¦ä¸ï¼ä¾ï¼è¦ç¸è«ã»æ30ä¸åãï¼' },
              { key: 'å¤åå°', label: 'å¤åå°' },
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
              { key: 'æ¥­ååå®¹', label: 'æ¥­ååå®¹' },
              { key: 'å¿åæ¡ä»¶', label: 'å¿åæ¡ä»¶ï¼ä»»æï¼' },
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>å¬éè¨­å®</label>
              <select
                value={newJob['å¬é']}
                onChange={e => setNewJob({ ...newJob, 'å¬é': e.target.value })}
                style={{ ...inputStyle, width: 'auto' }}
              >
                <option value="TRUE">å¬é</option>
                <option value="FALSE">éå¬é</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={handleAdd}
              disabled={addSaving || !newJob['è·ç¨®å']}
              style={{ background: addSaving ? '#999' : '#b8954a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              {addSaving ? 'è¿½å ä¸­...' : 'è¿½å ãã'}
            </button>
            <button
              onClick={() => setAdding(false)}
              style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
            >
              ã­ã£ã³ã»ã«
            </button>
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '10px', padding: '48px', textAlign: 'center', color: '#999', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          æ±äººæå ±ã¯ã¾ã ããã¾ããããæ±äººãè¿½å ãããç»é²ãã¦ãã ããã
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {jobs.map((job, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: editIndex === i ? '2px solid #b8954a' : '1px solid transparent' }}>
              {editIndex === i ? (
                <div>
                  <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
                    {[
                      { key: 'è·ç¨®å', label: 'è·ç¨®å' },
                      { key: 'éç¨å½¢æ', label: 'éç¨å½¢æ' },
                      { key: 'çµ¦ä¸', label: 'çµ¦ä¸' },
                      { key: 'å¤åå°', label: 'å¤åå°' },
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
                      { key: 'æ¥­ååå®¹', label: 'æ¥­ååå®¹' },
                      { key: 'å¿åæ¡ä»¶', label: 'å¿åæ¡ä»¶' },
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
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#666', marginBottom: '3px' }}>å¬éè¨­å®</label>
                      <select
                        value={editData['å¬é'] || 'TRUE'}
                        onChange={e => setEditData({ ...editData, 'å¬é': e.target.value })}
                        style={{ ...inputStyle, width: 'auto' }}
                      >
                        <option value="TRUE">å¬é</option>
                        <option value="FALSE">éå¬é</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleSaveEdit(i)}
                      disabled={saving === i}
                      style={{ background: saving === i ? '#999' : '#b8954a', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      {saving === i ? 'ä¿å­ä¸­...' : saved === i ? 'â ä¿å­æ¸' : 'ä¿å­'}
                    </button>
                    <button
                      onClick={() => { setEditIndex(null); setEditData(null) }}
                      style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
                    >
                      ã­ã£ã³ã»ã«
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a2744', margin: 0 }}>
                          {job['è·ç¨®å'] || 'ï¼è·ç¨®åãªãï¼'}
                        </h3>
                        <span style={{
                          background: job['å¬é'] === 'TRUE' ? '#e8f5e9' : '#fafafa',
                          color: job['å¬é'] === 'TRUE' ? '#27ae60' : '#999',
                          border: `1px solid ${job['å¬é'] === 'TRUE' ? '#c8e6c9' : '#e0e0e0'}`,
                          borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '600'
                        }}>
                          {job['å¬é'] === 'TRUE' ? 'å¬éä¸­' : 'éå¬é'}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '6px', marginBottom: '8px' }}>
                        {job['éç¨å½¢æ'] && <span style={{ fontSize: '13px', color: '#555' }}>ð {job['éç¨å½¢æ']}</span>}
                        {job['çµ¦ä¸'] && <span style={{ fontSize: '13px', color: '#555' }}>ð´ {job['çµ¦ä¸']}</span>}
                        {job['å¤åå°'] && <span style={{ fontSize: '13px', color: '#555' }}>ð {job['å¤åå°']}</span>}
                      </div>
                      {job['æ¥­ååå®¹'] && (
                        <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                          {job['æ¥­ååå®¹'].slice(0, 120)}{job['æ¥­ååå®¹'].length > 120 ? 'â¦' : ''}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleTogglePublish(i, job['å¬é'])}
                        disabled={saving === i}
                        style={{
                          background: job['å¬é'] === 'TRUE' ? '#fff3cd' : '#e8f5e9',
                          color: job['å¬é'] === 'TRUE' ? '#856404' : '#27ae60',
                          border: `1px solid ${job['å¬é'] === 'TRUE' ? '#ffc107' : '#c8e6c9'}`,
                          padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                        }}
                      >
                        {saving === i ? 'â¦' : job['å¬é'] === 'TRUE' ? 'éå¬éã«ãã' : 'å¬éãã'}
                      </button>
                      <button
                        onClick={() => { setEditIndex(i); setEditData({ ...job }) }}
                        style={{ background: '#f8f9fa', color: '#333', border: '1px solid #ddd', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        ç·¨é
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
