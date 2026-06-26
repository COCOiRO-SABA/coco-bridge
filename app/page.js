async function getSiteConfig() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=サイト全体設定`, { cache: 'no-store' })
    const data = await res.json()
    const config = {}
    data.forEach(row => { config[row['項目キー']] = row['値'] })
    return config
  } catch (e) {
    return {}
  }
}
async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=サービス`, { cache: 'no-store' })
    const data = await res.json()
    return data.filter(s => s['公開'] === true || s['公開'] === 'TRUE')
  } catch (e) {
    return []
  }
}
async function getSections() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=セクション設定`, { cache: 'no-store' })
    const data = await res.json()
    const map = {}
    data.forEach(row => { map[row['セクションID']] = row['表示'] === true || row['表示'] === 'TRUE' })
    return map
  } catch (e) {
    return {}
  }
}
async function getNews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=お知らせ`, { cache: 'no-store' })
    const data = await res.json()
    return data.filter(p => p['ステータス'] === '公開').slice(0, 3)
  } catch (e) {
    return []
  }
}
export default async function Home() {
  const [config, services, sections, news] = await Promise.all([
    getSiteConfig(),
    getServices(),
    getSections(),
    getNews(),
  ])
  return (
    <>
      {/* ナビゲーション */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          COCO<span>&</span>Bridge
        </a>
        <ul className="nav-links">
          <li><a href="/services">サービス</a></li>
          <li><a href="/about">私たちについて</a></li>
          <li><a href="/blog">ブログ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
      </nav>
      {/* ヒーロー */}
      {sections.hero !== false && (
        <section className="hero">
          <h1>{config.catch_copy || 'デジタルで、ビジネスの橋を架ける。'}</h1>
          <p>{config.sub_copy || 'あなたの「なぜ」から考える、個人の外部DXパートナー'}</p>
          <a href={config.cta_url || '/contact'} className="btn-primary">
            {config.cta_text || '無料相談はこちら'}
          </a>
          <a href="/services" className="btn-outline">サービスを見る</a>
        </section>
      )}
      {/* コンセプト */}
      {sections.concept !== false && (
        <section className="section">
          <p className="section-subtitle">CONCEPT</p>
          <h2 className="section-title">{config.concept_title || 'COCO&Bridgeについて'}</h2>
          <p style={{ fontSize: '16px', lineHeight: '2', color: 'var(--gray-600)', maxWidth: '760px', whiteSpace: 'pre-line' }}>
            {config.concept_body}
          </p>
        </section>
      )}
      {/* サービス */}
      {sections.services !== false && (
        <section className="section" style={{ background: 'var(--gray-100)', maxWidth: '100%', padding: '80px 40px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p className="section-subtitle">SERVICES</p>
            <h2 className="section-title">サービス一覧</h2>
            <div className="services-grid">
              {services.map((service, i) => (
                <div key={i} className="service-card">
                  <p className="service-card-category">{service['カテゴリ']}</p>
                  <h3>{service['サービス名']}</h3>
                  <p>{service['キャッチコピー']}</p>
                  {service['月額料金'] && (
                    <div className="service-card-price">
                      月額 <strong>¥{Number(service['月額料金']).toLocaleString()}</strong> 〜
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <a href="/services" className="btn-primary">サービス詳細を見る</a>
            </div>
          </div>
        </section>
      )}
      {/* 代表プロフィール */}
      {sections.profile !== false && (
        <section className="section">
          <p className="section-subtitle">PROFILE</p>
          <h2 className="section-title">代表プロフィール</h2>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: '200px', height: '200px', background: 'var(--gray-200)', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)', fontSize: '14px' }}>
              写真
            </div>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h3 style={{ fontSize: '22px', color: 'var(--navy)', marginBottom: '8px' }}>{config.profile_name}</h3>
              <p style={{ fontSize: '15px', lineHeight: '2', color: 'var(--gray-600)', whiteSpace: 'pre-line' }}>
                {config.profile_body}
              </p>
            </div>
          </div>
        </section>
      )}
      {/* お知らせ */}
      {sections.news !== false && news.length > 0 && (
        <section className="section" style={{ background: 'var(--gray-100)', maxWidth: '100%', padding: '80px 40px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p className="section-subtitle">NEWS</p>
            <h2 className="section-title">お知らせ</h2>
            <div style={{ display: 'grid', gap: '16px', marginTop: '32px' }}>
              {news.map((post, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{post['公開日']}</span>
                  <span style={{ fontSize: '12px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{post['カテゴリ']}</span>
                  <span style={{ fontSize: '15px', color: 'var(--navy)' }}>{post['タイトル']}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <a href="/blog" className="btn-outline" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }}>お知らせ一覧</a>
            </div>
          </div>
        </section>
      )}
      {/* CTA */}
      {sections.cta !== false && (
        <section style={{ background: 'var(--navy)', padding: '80px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', color: 'white', marginBottom: '16px' }}>
            まずは気軽に相談ください
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
            貴社の課題をヒアリングし、最適なプランを提案します。
          </p>
          <a href={config.cta_url || '/contact'} className="btn-primary">
            {config.cta_text || '無料相談はこちら'}
          </a>
        </section>
      )}
      {/* フッター */}
      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge / 田村 恵'}</p>
      </footer>
    </>
  )
}
