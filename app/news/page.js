function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=ãç¥ãã`, { cache: 'no-store' })
    const data = await res.json()
    return data.filter(p => p['ã¹ãã¼ã¿ã¹'] === 'å¬é')
  } catch (e) {
    return []
  }
}

async function getConfig() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=ãµã¤ãå¨ä½è¨­å®`, { cache: 'no-store' })
    const data = await res.json()
    const config = {}
    data.forEach(row => { config[row['é ç®ã­ã¼']] = row['å¤'] })
    return config
  } catch (e) {
    return {}
  }
}

export const metadata = {
  title: 'ãç¥ããï½COCO&Bridge',
  description: 'COCO&Bridgeããã®ãç¥ããããå±ããã¾ãã',
}

export default async function NewsPage() {
  const [posts, config] = await Promise.all([getPosts(), getConfig()])

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
          <div className="hero-shape" /><div className="hero-shape" /><div className="hero-shape" />
        </div>
        <h1>ãç¥ãã</h1>
        <p>COCO&Bridgeããã®ææ°æå ±ããå±ããã¾ãã</p>
      </section>

      <section className="section">
        {posts.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {posts.map((post, i) => (
              <a
                key={i}
                href={`/news/${post['ã¹ã©ãã°']}`}
                className="service-card-hover"
                style={{ textDecoration: 'none', border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '24px', display: 'block' }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                    {post['ã«ãã´ãª']}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{formatDate(post['å¬éæ¥'])}</span>
                </div>
                <h3 style={{ fontSize: '17px', color: 'var(--navy)', marginBottom: '8px' }}>{post['ã¿ã¤ãã«']}</h3>
                <p style={{
                  fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.8',
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {post['æ¬æ']}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-600)' }}>
            <p>ç¾å¨ããç¥ããã¯ããã¾ããã</p>
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>Â© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridgeæ ªå¼ä¼ç¤¾'}</p>
      </footer>
    </>
  )
}
