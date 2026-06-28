'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API + '?sheet=サービス')
      const data = await res.json()
      setServices(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleTogglePublish = async (service, index) => {
    const rowIndex = index + 2
    const newValue = service['公開'] === true || service['公開'] === 'TRUE' ? 'FALSE' : 'TRUE'
    setSaving(index)
    try {
      await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          sheet: 'サービス', action: 'updateRow', rowIndex,
          data: { '公開': newValue },
        }),
      })
      setServices(prev => prev.map((s, i) => i === index ? { ...s, '公開': newValue } : s))
    } catch (e) {
      console.error(e)
    }
    setSaving(null)
  }

  const handleEdit = (service, index) => {
    setEditingId(index)
    setEditData({ ...service })
  }

  const handleSaveEdit = async (index) => {
    const rowIndex = index + 2
    setSaving(index)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          sheet: 'サービス', action: 'updateRow', rowIndex, data: editData,
        }),
      })
      const result = await res.json()
      console.log('保存結果:', result)
      if (result.success) {
        setServices(prev => prev.map((s, i) => i === index ? { ...editData } : s))
        setEditingId(null)
      } else {
        alert('保存に失敗しました: ' + JSON.stringify(result))
      }
    } catch (e) {
      console.error('保存エラー:', e)
      alert('通信エラーが発生しました: ' + e.message)
    }
    setSaving(null)
  }

  return (
    <AdminLayout current="services">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '4px' }}>サービス管理</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>サービスカードの内容と公開状態を管理します</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>読み込み中...</div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {services.map((service, index) => {
            const isOn = service['公開'] === true || service['公開'] === 'TRUE'
            const isEditing = editingId === index
            const isSaving = saving === index

            return (
              <div key={index} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', opacity: isOn ? 1 : 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{service['アイコン'] || '🔧'}</span>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#1a2744' }}>{service['タイトル']}</span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: isOn ? '#e8f5e9' : '#f5f5f5', color: isOn ? '#27ae60' : '#999' }}>
                      {isOn ? '公開中' : '非公開'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!isEditing && (
                      <button
                        onClick={() => handleEdit(service, index)}
                        style={{ background: '#f0f2f5', color: '#1a2744', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        編集
                      </button>
                    )}
                    <button
                      onClick={() => handleTogglePublish(service, index)}
                      disabled={isSaving}
                      style={{
                        width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                        background: isOn ? '#b8954a' : '#ddd', position: 'relative', opacity: isSaving ? 0.6 : 1,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: '2px', width: '20px', height: '20px',
                        borderRadius: '50%', background: 'white',
                        left: isOn ? '22px' : '2px', transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div style={{ display: 'grid', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                    {['タイトル', 'アイコン', '説明', '詳細'].map(key => (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>{key}</label>
                        {key === '詳細' || key === '説明' ? (
                          <textarea
                            value={editData[key] || ''}
                            onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                            rows={3}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                          />
                        ) : (
                          <input
                            type="text"
                            value={editData[key] || ''}
                            onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        )}
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{ background: '#f0f2f5', color: '#666', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={() => handleSaveEdit(index)}
                        disabled={isSaving}
                        style={{ background: '#b8954a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        {isSaving ? '保存中...' : '保存'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.6' }}>{service['説明']}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}
