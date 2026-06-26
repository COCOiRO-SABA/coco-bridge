async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=サービス`, { cache: 'no-store' })
    const data = await res.json()
    return data.filter(s => s['公開'] === true || s['公開'] === 'TRUE')
  } catch (e) {
    return []
  }
}
async function getConfig() {
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
export const metadata = {
  title: 'サービス一覧｜COCO&Bridge',
  description: 'ウェブ制作・SNS/LINE運用・DX業務効率化・介護業界参入コンサルの4サービスを提供しています。',
}
export default async function ServicesPage() {
  const [services, config] = await Promise.all([getServices(), getConfig()])
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
        <h1>サービス<span>一覧</span></h1>
        <p>あなたの課題に合ったサービスを提案します。</p>
      </section>
      <section className="section">
        <div className="services-grid">
          {services.map((service, i) => (
            <div key={i} className="service-card">
              <p className="service-card-category">{service['カテゴリ']}</p>
              <h3>{service['サービス名']}</h3>
              <p>{service['キャッチコピー']}</p>
              <p style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '12px', lineHeight: '1.8' }}>
                {service['本文']}
              </p>
              {service['月額料金'] && (
                <div className="service-card-price">
                  月額 <strong>¥{Number(service['月額料金']).toLocaleString()}</strong> 〜
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <section style={{ background: 'var(--navy)', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', color: 'white', marginBottom: '16px' }}>まずは気軽に相談ください</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>貴社の課題をヒアリングし、最適なプランを提案します。</p>
        <a href={config.cta_url || '/contact'} className="btn-primary">{config.cta_text || '無料相談はこちら'}</a>
      </section>
      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge / 田村 恵'}</p>
      </footer>
    </>
  )
}
