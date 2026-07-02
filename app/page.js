const GAS_API = process.env.NEXT_PUBLIC_GAS_API

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return String(value)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

async function getSiteConfig() {
  try {
    const res = await fetch(`${GAS_API}?sheet=サイト全体設定`, { cache: 'no-store' })
    const data = await res.json()
    const config = {}
    data.forEach(row => { config[row['項目キー']] = row['値'] })
    return config
  } catch (e) { return {} }
}

async function getServices() {
  try {
    const res = await fetch(`${GAS_API}?sheet=サービス`, { cache: 'no-store' })
    const data = await res.json()
    return data.filter(s => s['公開'] === true || s['公開'] === 'TRUE' || s['公開'] === '公開')
  } catch (e) { return [] }
}

async function getSections() {
  try {
    const res = await fetch(`${GAS_API}?sheet=セクション設定`, { cache: 'no-store' })
    const data = await res.json()
    const sections = {}
    data.forEach(row => {
      sections[row['セクションID']] = row['表示'] === true || row['表示'] === 'TRUE'
    })
    return sections
  } catch (e) { return {} }
}

async function getNews() {
  try {
    const res = await fetch(`${GAS_API}?sheet=お知らせ`, { cache: 'no-store' })
    const data = await res.json()
    return data.filter(n => n['ステータス'] === '公開').slice(0, 3)
  } catch (e) { return [] }
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
          <li><a href="/news">お知らせ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
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
            <a href={config.cta_url || '/contact'} className="btn-primary">
              {config.cta_text || '無料相談はこちら'}
            </a>
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
          <div style={{ maxWidth: '760px', margin: '32px auto 0', display: 'grid', gap: '8px' }}>
            {news.map((post, i) => (
              <a key={i} href={`/news/${post['スラッグ']}`} style={{ textDecoration: 'none', background: 'white', borderRadius: '8px', padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{formatDate(post['公開日'])}</span>
                <span style={{ fontSize: '12px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{post['カテゴリ']}</span>
                <span style={{ fontSize: '15px', color: 'var(--navy)' }}>{post['タイトル']}</span>
              </a>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a href="/news" style={{ fontSize: '14px', color: 'var(--navy)', borderBottom: '1px solid var(--navy)', paddingBottom: '2px' }}>お知らせ一覧を見る →</a>
          </div>
        </section>
      )}

      {sections.cta !== false && (
        <section style={{ background: '#f5f0e8', padding: '100px 40px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '16px' }}>CONTACT</p>
          <h2 style={{ fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif", fontSize: '32px', color: 'var(--navy)', marginBottom: '16px', fontWeight: '700' }}>
            まずは気軽に相談ください
          </h2>
          <p style={{ color: '#666', marginBottom: '40px', fontSize: '15px', lineHeight: '1.8' }}>
            貴社の課題をヒアリングし、最適なプランを提案します。
          </p>
          <a href={config.cta_url || '/contact'} className="btn-primary">
            {config.cta_text || '無料相談はこちら'}
          </a>
        </section>
      )}

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>
          {'©'} {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}
        </p>
      </footer>
    </>
  )
}
