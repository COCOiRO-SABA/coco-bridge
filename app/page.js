const GAS_API = process.env.NEXT_PUBLIC_GAS_API

async function getSiteConfig() {
  const res = await fetch(`${GAS_API}?sheet=サイト全体設定`, { cache: 'no-store' })
  const data = await res.json()
  const config = {}
  data.forEach(row => { config[row['項目キー']] = row['値'] })
  return config
}

async function getServices() {
  const res = await fetch(`${GAS_API}?sheet=サービス`, { cache: 'no-store' })
  const data = await res.json()
  return data.filter(s => s['公開'] === true || s['公開'] === 'TRUE' || s['公開'] === '公開')
}

async function getSections() {
  const res = await fetch(`${GAS_API}?sheet=セクション設定`, { cache: 'no-store' })
  const data = await res.json()
  const sections = {}
  data.forEach(row => {
    sections[row['セクションID']] = row['表示'] === true || row['表示'] === 'TRUE'
  })
  return sections
}

async function getNews() {
  const res = await fetch(`${GAS_API}?sheet=お知らせ`, { cache: 'no-store' })
  const data = await res.json()
  return data.filter(n => n['ステータス'] === '公開').slice(0, 3)
}

export const metadata = {
  title: 'COCO&Bridge | 中小企業のデジタル伴走パートナー',
  description: 'ウェブ制作・SNS運用・業務自動化・DX推進を一気通貫で伴走するDXパートナー。',
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
          <li><a href="/services">サービス</a></li>
          <li><a href="/about">私たちについて</a></li>
          <li><a href="/blog">ブログ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
      </nav>

      {sections.hero !== false && (
        <section className="hero">
          <p className="hero-sub">{config.catch_copy}</p>
          <h1>{config.site_name || 'COCO&Bridge'}</h1>
          <p className="hero-desc">{config.sub_copy}</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <a href={config.cta_url || '/contact'} className="btn-primary">{config.cta_text || '無料相談はこちら'}</a>
            <a href="/services" className="btn-outline">サービスを見る</a>
          </div>
        </section>
      )}

      {sections.concept !== false && (
        <section className="section">
          <p className="section-subtitle">CONCEPT</p>
          <h2 className="section-title">{config.concept_title || 'COCO&Bridgeについて'}</h2>
          <p style={{ fontSize: '16px', lineHeight: '2', color: 'var(--gray-600)', maxWidth: '760px', margin: '32px auto 0', whiteSpace: 'pre-line' }}>
            {config.concept_body}
          </p>
        </section>
      )}

      {sections.services !== false && services.length > 0 && (
        <section className="section" style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
          <p className="section-subtitle">SERVICES</p>
          <h2 className="section-title">サービス一覧</h2>
          <div className="card-grid" style={{ marginTop: '48px' }}>
            {services.map((s, i) => (
              <div key={i} className="card">
                <p style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  {s['カテゴリ']}
                </p>
                <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '12px' }}>{s['サービス名']}</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '16px' }}>{s['キャッチコピー']}</p>
                <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.7' }}>{s['説明']}</p>
                {s['価格'] && (
                  <p style={{ marginTop: '16px', fontSize: '15px', color: 'var(--gold)', fontWeight: '600' }}>{s['価格']}</p>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a href="/services" className="btn-outline">サービス詳細を見る</a>
          </div>
        </section>
      )}

      {sections.profile !== false && (
        <section className="section">
          <p className="section-subtitle">PROFILE</p>
          <h2 className="section-title">代表プロフィール</h2>
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
                プロフィール詳細 →
              </a>
            </div>
          </div>
        </section>
      )}

      {sections.news !== false && news.length > 0 && (
        <section className="section" style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
          <p className="section-subtitle">NEWS</p>
          <h2 className="section-title">お知らせ</h2>
          <ul style={{ listStyle: 'none', padding: 0, maxWidth: '760px', margin: '32px auto 0' }}>
            {news.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '24px', padding: '20px 0', borderBottom: '1px solid var(--gray-200)', alignItems: 'baseline' }}>
                <time style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{item['日付']}</time>
                <span style={{ fontSize: '15px', color: 'var(--navy)' }}>{item['タイトル']}</span>
              </li>
            ))}
          </ul>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a href="/blog" style={{ fontSize: '14px', color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>
              お知らせ一覧を見る →
            </a>
          </div>
        </section>
      )}

      {sections.cta !== false && (
        <section className="section" style={{ background: 'var(--navy)', color: 'white', textAlign: 'center' }}>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>CONTACT</p>
          <h2 className="section-title" style={{ color: 'white' }}>お問い合わせ</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>{config.cta_text || 'まずはお気軽にご相談ください。'}</p>
          <a href={config.cta_url || '/contact'} className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>
            お問い合わせはこちら
          </a>
        </section>
      )}

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
      </footer>
    </>
  )
}
