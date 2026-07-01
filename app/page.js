const GAS_API = process.env.NEXT_PUBLIC_GAS_API

async function getSiteConfig() {
  const res = await fetch(`${GAS_API}?sheet=ãµã¤ãå¨ä½è¨­å®`, { cache: 'no-store' })
  const data = await res.json()
  const config = {}
  data.forEach(row => { config[row['é ç®ã­ã¼']] = row['å¤'] })
  return config
}

async function getServices() {
  const res = await fetch(`${GAS_API}?sheet=ãµã¼ãã¹`, { cache: 'no-store' })
  const data = await res.json()
  return data.filter(s => s['å¬é'] === true || s['å¬é'] === 'TRUE' || s['å¬é'] === 'å¬é')
}

async function getSections() {
  const res = await fetch(`${GAS_API}?sheet=ã»ã¯ã·ã§ã³è¨­å®`, { cache: 'no-store' })
  const data = await res.json()
  const sections = {}
  data.forEach(row => {
    sections[row['ã»ã¯ã·ã§ã³ID']] = row['è¡¨ç¤º'] === true || row['è¡¨ç¤º'] === 'TRUE'
  })
  return sections
}

async function getNews() {
  const res = await fetch(`${GAS_API}?sheet=ãç¥ãã`, { cache: 'no-store' })
  const data = await res.json()
  return data.filter(n => n['ã¹ãã¼ã¿ã¹'] === 'å¬é').slice(0, 3)
}

export const metadata = {
  title: 'COCO&Bridge | ä¸­å°ä¼æ¥­ã®ãã¸ã¿ã«ä¼´èµ°ãã¼ããã¼',
  description: 'ã¦ã§ãå¶ä½ã»SNSéç¨ã»æ¥­åèªååã»DXæ¨é²ãä¸æ°éè²«ã§ä¼´èµ°ããDXãã¼ããã¼ã',
}

export default async function Home() {
  const [config, services, sections, news] = await Promise.all([
    getSiteConfig(), getServices(), getSections(), getNews()
  ])

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">COCO<span>&</span>Bridge</a>
        <ul className="nav-links">
          <li><a href="/services">ãµã¼ãã¹</a></li>
          <li><a href="/about">ç§ãã¡ã«ã¤ãã¦</a></li>
          <li><a href="/blog">ãã­ã°</a></li>
          <li><a href="/contact">ãåãåãã</a></li>
        </ul>
      </nav>

      {sections.hero !== false && (
        <section className="hero">
          <div className="hero-photo-bg">
            <img src={config.profile_image || 'https://coco-i-ro.com/wp-content/uploads/2025/12/0019_original-scaled.jpg'} alt="" />
          </div>
          <p className="hero-sub">{config.catch_copy}</p>
          <h1>{config.site_name || 'COCO&Bridge'}</h1>
          <p className="hero-desc">{config.sub_copy}</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <a href={config.cta_url || '/contact'} className="btn-primary">{config.cta_text || 'ç¡æç¸è«ã¯ãã¡ã'}|/a>
            <a href="/services" className="btn-outline">ãµã¼ãã¹ãè¦ã</a>
          </div>
        </section>
      )}

      {sections.concept !== false && (
        <section className="section">
          <p className="section-subtitle">CONCEPT</p>
          <h2 className="section-title">{config.concept_title || 'COCO&Bridgeã«ã¤ãã¦'}</h2>
          <p style={{ fontSize: '16px', lineHeight: '2', color: 'var(--gray-600)', maxWidth: '760px', margin: '32px auto 0', whiteSpace: 'pre-line' }}>
            {config.concept_body}
          </p>
        </section>
      )}

      {sections.services !== false && services.length > 0 && (
        <section className="section" style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
          <p className="section-subtitle">SERVICES</p>
          <h2 className="section-title">ãµã¼ãã¹ä¸è¦§</h2>
          <div className="card-grid" style={{ marginTop: '48px' }}>
            {services.map((s, i) => (
              <div key={i} className="card">
                <p style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  {s['ã«ãã´ãª']}
                </p>
                <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '12px' }}>{s['ãµã¼ãã¹å']}</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '16px' }}>{s['ã­ã£ããã³ãã¼']}</p>
                <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.7' }}>{s['èª¬æ']}</p>
                {s['ä¾¡æ ¼'] && (
                  <p style={{ marginTop: '16px', fontSize: '15px', color: 'var(--gold)', fontWeight: '600' }}>{s['ä¾¡æ ¼']}</p>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a href="/services" className="btn-outline">ãµã¼ãã¹è©³ç´°ãè¦ã</a>
          </div>
        </section>
      )}

      {sections.profile !== false && (
        <section className="section">
          <p className="section-subtitle">PROFILE</p>
          <h2 className="section-title">ä»£è¡¨ãã­ãã£ã¼ã«</h2>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginTop: '48px', flexWrap: 'wrap' }}>
            <img
              src={config.profile_image}
              alt={config.profile_name}
              style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: '240px' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '12px' }}>{config.profile_name}</h3>
              <p style={{ fontSize: '15px', lineHeight: '1.9', color: 'var(--gray-600)' }}>{config.profile_short}</p>
              <a href="/about" style={{ display: 'inline-block', marginTop: '16px', fontSize: '14px', color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>
                ãã­ãã£ã¼ã«è©³ç´° â
              </a>
            </div>
          </div>
        </section>
      )}

      {sections.news !== false && news.length > 0 && (
        <section className="section" style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
          <p className="section-subtitle">NEWS</p>
          <h2 className="section-title">ãç¥ãã</h2>
          <ul style={{ listStyle: 'none', padding: 0, maxWidth: '760px', margin: '32px auto 0' }}>
            {news.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '24px', padding: '20px 0', borderBottom: '1px solid var(--gray-200)', alignItems: 'baseline' }}>
                <time style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{item['æ¥ä»']}</time>
                <span style={{ fontSize: '15px', color: 'var(--navy)' }}>{item['ã¿ã¤ãã«']}</span>
              </li>
            ))}
          </ul>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a href="/blog" style={{ fontSize: '14px', color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>
              ãç¥ããä¸è¦§ãè¦ã â
            </a>
          </div>
        </section>
      )}

      {sections.cta !== false && (
        <section className="section" style={{ background: 'var(--navy)', color: 'white', textAlign: 'center' }}>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>CONTACT</p>
          <h2 className="section-title" style={{ color: 'white' }}>ãåãåãã</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>{config.cta_text || 'ã¾ãã¯ãæ°è»½ã«ãç¸è«ãã ããã'}</p>
          <a href={config.cta_url || '/contact'} className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>
            ãåãåããã¯ãã¡ã
          </a>
        </section>
      )}

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>Â© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridgeæ ªå¼ä¼ç¤¾'}|/p>
      </footer>
    </>
  )
}
