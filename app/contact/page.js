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
      setError('ãã©ã¤ãâ¥ã·ã¼ããªã·ã¼ã«åæãã¦ãã ããã')
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
        throw new Error(result.error || 'éä¿¡ã«å¤±æãã¾ãã')
      }
    } catch (err) {
      setStatus('')
      setError('éä¿¡ã«å¤±æãã¾ãããæéãããã¦ååº¦ãè©¦ããã ããã')
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
  }

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">COCO<span>&</span>Bridge</a>
        <ul className="nav-links">
          <li><a href="/services">ãµã¼ãã¹</a></li>
          <li><a href="/about">ç§ãã¡ã«ã¤ãã¦</a></li>
          <li><a href="/news">ãç¥ãã</a></li>
          <li><a href="/contact">ãåãåãã</a></li>
        </ul>
      </nav>

      <section className="hero" style={{ padding: '60px 40px' }}>
        <div className="hero-bg">
          <div className="hero-shape" />
          <div className="hero-shape" />
          <div className="hero-shape" />
        </div>
        <h1>ãåã<span>åãã</span></h1>
        <p>ã¾ãã¯ãæ°è»½ã«ãç¸è«ãã ãããéå¸¸2å¶æ¥­æ¥ä»¥åã«è¿ä¿¡ãã¾ãã</p>
      </section>

      <section style={{ padding: '80px 40px', maxWidth: '700px', margin: '0 auto' }}>
        {status === 'done' ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '56px', marginBottom: '24px' }}>&#x2705;</div>
            <p style={{ fontSize: '22px', color: '#1a2744', fontWeight: '700', marginBottom: '12px' }}>
              éä¿¡å®äºãã¾ãã
            </p>
            <p style={{ color: '#666', lineHeight: '1.8' }}>
              åãåãããããã¨ããããã¾ãã<br />
              2å¶æ¥­æ¥ä»¥åã«é£çµ¡ãã¾ãã
            </p>
            <a href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '32px' }}>
              ãããã«æ»ã
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
                ãåå<span style={{ color: '#b8954a', marginLeft: '4px' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="ç°æ æµ"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>ä¼ç¤¾å</label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder="æ ªå¼ä¼ç¤¾ãã"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                ã¡ã¼ã«ã¢ãã¬ã¹<span style={{ color: '#b8954a', marginLeft: '4px' }}>*</span>
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
              <label style={labelStyle}>é»è©±çªå·</label>
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
                åãåããåå®¹<span style={{ color: '#b8954a', marginLeft: '4px' }}>*</span>
              </label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="ãµã¼ãã¹ã«ã¤ãã¦ã®ãè³ªåããè¦ç©ããä¾é ¼ãªã©ããæ°è»½ã«ã©ããã"
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
                <a href="/privacy" target="_blank" style={{ color: '#b8954a', textDecoration: 'underline' }}>ãã©ã¤ãã·ã¼ããªã·ã¼</a>
                ã«åæãã¾ã<span style={{ color: '#b8954a', marginLeft: '4px' }}>*</span>
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
              {status === 'sending' ? 'éä¿¡ä¸­...' : 'éä¿¡ãã'}
            </button>

            <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', lineHeight: '1.6' }}>
              ãã®ãµã¤ãã¯reCAPTCHAã§ä¿è­·ããã¦ãããGoogleã®
              <a href="https://policies.google.com/privacy" target="_blank" style={{ color: '#999' }}>ãã©ã¤ãã·ã¼ããªã·ã¼</a>ã¨
              <a href="https://policies.google.com/terms" target="_blank" style={{ color: '#999' }}>å©ç¨è¦ç´</a>
              ãé©ç¨ããã¾ãã
            </p>
          </form>
        )}
      </section>

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>&#169; {new Date().getFullYear()} COCO&Bridgeæ ªå¼ä¼ç¤¾</p>
      </footer>
    </>
  )
}
