'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', message: '',
  })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'contact', data: form }),
      })
      const result = await res.json()
      if (result.success) {
        setStatus('done')
      } else {
        throw new Error(result.error || '送信に失敗しました')
      }
    } catch (err) {
      setStatus('')
      setError('送信に失敗しました。時間をおいて再度お試しください。')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--gray-200)',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    outline: 'none',
    background: 'white',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--navy)',
  }

  const fields = [
    { label: 'お名前', key: 'name', type: 'text', required: true },
    { label: '会社名', key: 'company', type: 'text', required: false },
    { label: 'メールアドレス', key: 'email', type: 'email', required: true },
    { label: '電話番号', key: 'phone', type: 'tel', required: false },
  ]

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">COCO<span>&</span>Bridge</a>
        <ul className="nav-links">
          <li><a href="/services">サービス</a></li>
          <li><a href="/about">私たちについて</a></li>
          <li><a href="/blog">ブログ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
      </nav>

      <section className="hero" style={{ padding: '60px 40px' }}>
        <h1>お問い合わせ<span></span></h1>
        <p>まずはお気軽にご相談ください。通常2営業日以内に返信します。</p>
      </section>

      <section className="section" style={{ maxWidth: '700px' }}>
        {status === 'done' ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '24px', color: 'var(--navy)', marginBottom: '16px' }}>✅ 送信完了しました</p>
            <p style={{ color: 'var(--gray-600)' }}>お問い合わせありがとうございます。2営業日以内に連絡します。</p>
            <a href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '32px' }}>トップに戻る</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
            {fields.map((field) => (
              <div key={field.key}>
                <label style={labelStyle}>
                  {field.label}{field.required && <span style={{ color: 'var(--gold)', marginLeft: '4px' }}>*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.key}
                  value={form[field.key]}
                  onChange={handleChange}
                  required={field.required}
                  style={inputStyle}
                />
              </div>
            ))}
            <div>
              <label style={labelStyle}>
                お問い合わせ内容<span style={{ color: 'var(--gold)', marginLeft: '4px' }}>*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            {error && (
              <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary"
              style={{ justifySelf: 'start', opacity: status === 'sending' ? 0.7 : 1 }}
            >
              {status === 'sending' ? '送信中...' : '送信する'}
            </button>
          </form>
        )}
      </section>
    </>
  )
}
