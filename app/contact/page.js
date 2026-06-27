'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'contact', data: form }),
      })
      const json = await res.json()
      if (json.success) {
        setStatus('done')
        setForm({ name: '', company: '', email: '', phone: '', message: '' })
      } else {
        setStatus('error')
        setErrorMsg(json.error || '送信に失敗しました')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg('通信エラーが発生しました。しばらく経ってから再度お試しください。')
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-bg" style={{ padding: '80px 24px 60px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
          お問い<span style={{ color: '#c9a84c' }}>合わせ</span>
        </h1>
        <p style={{ marginTop: 12, color: '#555', fontSize: '0.95rem' }}>
          ご質問・ご相談はお気軽にどうぞ
        </p>
      </section>

      {/* Form */}
      <section style={{ maxWidth: 640, margin: '0 auto', padding: '60px 24px 80px' }}>
        {status === 'done' ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '1.1rem', color: '#1a1a1a', marginBottom: 8 }}>
              ✅ お問い合わせを受け付けました
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              担当者よりご連絡いたします。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[
              { label: 'お名前', name: 'name', type: 'text', required: true, placeholder: '田村 恵' },
              { label: '会社名', name: 'company', type: 'text', required: false, placeholder: '株式会社〇〇' },
              { label: 'メールアドレス', name: 'email', type: 'email', required: true, placeholder: 'example@mail.com' },
              { label: '電話番号', name: 'phone', type: 'tel', required: false, placeholder: '090-0000-0000' },
            ].map(({ label, name, type, required, placeholder }) => (
              <div key={name} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#444', marginBottom: 6 }}>
                  {label}{required && <span style={{ color: '#c9a84c', marginLeft: 4 }}>*</span>}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={required}
                  placeholder={placeholder}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#444', marginBottom: 6 }}>
                お問い合わせ内容<span style={{ color: '#c9a84c', marginLeft: 4 }}>*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="お問い合わせ内容をご記入ください"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: 24, lineHeight: 1.6 }}>
              ご入力いただいた個人情報は、お問い合わせへの回答のみに使用し、第三者への提供は行いません。
            </p>

            {status === 'error' && (
              <p style={{ color: '#c00', fontSize: '0.85rem', marginBottom: 16 }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                width: '100%',
                padding: '14px',
                background: status === 'sending' ? '#aaa' : '#1a1a1a',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                fontSize: '0.95rem',
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {status === 'sending' ? '送信中...' : '送信する'}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #eee', padding: '32px 24px', textAlign: 'center' }}>
        <nav style={{ marginBottom: 16, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {[
            { href: '/', label: 'ホーム' },
            { href: '/services', label: 'サービス' },
            { href: '/about', label: '私たちについて' },
            { href: '/blog', label: 'ブログ' },
            { href: '/contact', label: 'お問い合わせ' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{ color: '#555', fontSize: '0.85rem', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </nav>
        <p style={{ color: '#aaa', fontSize: '0.78rem', margin: 0 }}>
          © {new Date().getFullYear()} COCO&amp;Bridge. All rights reserved.
        </p>
      </footer>
    </>
  )
}
