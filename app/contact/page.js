'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1000))
    setStatus('done')
  }

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
        <h1>お問い<span>合わせ</span></h1>
        <p>まずはお気軽にご相談ください。通常2営業日以内に返信します。</p>
      </section>

      <section className="section" style={{ maxWidth: '700px' }}>
        {status === 'done' ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '24px', color: 'var(--navy)', marginBottom: '16px' }}>✅ 送信完了しました</p>
            <p style={{ color: 'var(--gray-600)' }}>問い合わせありがとうございます。2営業日以内に連絡します。</p>
            <a href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '32px' }}>トップに戻る</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
            {[
              { label: 'お名前', key: 'name', type: 'text', required: true },
              { label: '会社名', key: 'company', type: 'text', required: false },
              { label: 'メールアドレス', key: 'email', type: 'email', required: true },
              { label: '電話番号', key: 'phone', type: 'tel', required: false },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy)', marginBottom: '8px' }}>
                  {field.label}{field.required && <span style={{ color: 'var(--gold)', marginLeft: '4px' }}>*</span>}
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--gray-200)', borderRadius: '4px', fontSize: '15px' }}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy)', marginBottom: '8px' }}>
                問い合わせ内容<span style={{ color: 'var(--gold)', marginLeft: '4px' }}>*</span>
              </label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--gray-200)', borderRadius: '4px', fontSize: '15px', resize: 'vertical' }}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary"
              style={{ border: 'none', cursor: 'pointer', width: '100%', padding: '16px' }}
            >
              {status === 'sending' ? '送信中...' : '送信する'}
            </button>
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
