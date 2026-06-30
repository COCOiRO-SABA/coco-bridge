'use client'
import { useState, useEffect } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  })
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey) return
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  const getRecaptchaToken = () => {
    return new Promise((resolve) => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      if (!siteKey || typeof window.grecaptcha === 'undefined') {
        resolve(null)
        return
      }
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(siteKey, { action: 'contact' }).then(resolve)
      })
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed) {
      setError('プライバシーポリシーに同意してください。')
      return
    }
    setStatus('sending')
    setError('')
    try {
      const recaptchaToken = await getRecaptchaToken()
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'contact',
          data: { ...form, recaptchaToken },
        }),
      })
      const result = await res.json()
      if (result.success) {
        setStatus('done')
      } else {
        throw new Error(result.error || '送信に失敗しました')
      }
    } catch (err) {
      setStatus('')
      setError('送信に失敗しました。時間をおあて再度お試しください。')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#1a1a1a',
    background: 'white',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a2744',
    marginBottom: '8px',
  }a}

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">COCO<span>&</span>Bridge</a>
        <ul className="nav-links">
          <li><a href="/services">サービス</a></li>
          <li><a href="/about">私たちについて</a></li>
          <li><a href="/news">お知らせ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
    </ul>
    </nav>
      <section className="hero" style={{ padding: '60px 40px' }}>
        <div className="hero-bg">
          <div className="hero-shape" />
          <div className="hero-shape" />
          <div className="hero-shape" />
        </div>
        <h1>お問い<span>合わせ</span></h1>
        <p>まずはお気軽にご相談ください。通常2営業日以内に返信します。</p>
      </section>

      <section style={{ padding: '80px 40px', maxWidth: '700px', margin: '0 auto' }}>
        {status === 'done' ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '56px', marginBottom: '24px' }}>✅</div>
            <p style={{ fontSize: '22px', color: '#1a2744', fontWeight: '700', marginBottom: '12px' }}>
              送信完了しました
            </p>
            <p style={{ color: '#666', lineHeight: '1.8' }}>
              問い合わせありがとうございます。<br />
              2営業日以内に連絡します。
            </p>
            <a href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '32px' }}>
              トップに戻る
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '6px', padding: '12px 16px', color: '#cc0000', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div>
              <label style={labelStyle}>
                お名前<span style={{ color: '#b8954a', marginLeft: '4px' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="田村 恵"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>会社名</label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder="株式会社〇〇"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                メールアドレス<span style={{ color: '#b8954a', marginLeft: '4px' }}>*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="info@example.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>電話番号</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="03-0000-0000"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                問い合わせ内容<span style={{ color: '#b8954a', marginLeft: '4px' }}>*</span>
              </label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="サービスについてのご質問、お見積もり依頼など、お気軽にどうぞ。"
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.7' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <input
                type="checkbox"
                id="privacy"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: '3px', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
              />
              <label htmlFor="privacy" style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', cursor: 'pointer' }}>
                <a href="/privacy" target="_blank" style={{ color: '#b8954a', textDecoration: 'underline' }}>プライバシーポリシー</a>
                に同意します<span style={{ color: '#b8954a', marginLeft: '4px' }}>*</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'sending' || !agreed}
              className="btn-primary"
              style={{
                border: 'none',
                cursor: status === 'sending' || !agreed ? 'not-allowed' : 'pointer',
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                opacity: status === 'sending' || !agreed ? 0.6 : 1,
              }}
            >
              {status === 'sending' ? '送信中...' : '送信する'}
            </button>

            <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', lineHeight: '1.6' }}>
              このサイトはreCAPTCHAで保護されており� Googleの
              <a href="https://policies.google.com/privacy" target="_blank" style={{ color: '#999' }}>プライバシーポリシー</a>と
              <a href="https://policies.google.com/terms" target="_blank" style={{ color: '#999' }}>利用扏槴</a>
              が驧用されます。
            </p>
          </form>
        )}
      </section>

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} COCO&Bridge株式会社</p>
      </footer>
    </>
  )
}
