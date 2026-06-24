async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=サービス`, { cache: 'no-store' })
    const data = await res.json()
    return data.filter(s => s['公開'] === true || s['公開'] === 'TRUE')
  } catch (e) {
    return []
  }
}
export const metadata = {
  title: 'サービス一覧｜COCO&Bridge',
  description: 'ウェブ制作・SNS/LINE運用・DX業務効率化・介護業界参入コンサルの4サービスを提供しています。',
}
export default async function ServicesPage() {
  const services = await getServices()
  return (
    <>
      <nav className="nav">
        <div className="nav-logo">COCO<span>&</span>Bridge</div>
        <ul className="nav-links">
          <li><a href="/#services">サービス</a></li>
          <li><a href="/about">私たちについて</a></li>
          <li><a href="/blog">ブログ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
      </nav>
      <section className="hero" style={{ padding: '60px 40px' }}>
        <h1>サービス<span>一覧</span></h1>
        <p>あなたの課題に合ったサービスをご提案します。</p>
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
      <section style={{ background: 'var(--gray-100)', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', color: 'var(--navy)', marginBottom: '16px' }}>まずはお気軽にご相談ください</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>貴社の課題をヒアリングし、最適なプランを提案します。</p>
        <a href="/contact" className="btn-primary">無料相談・お問い合わせ</a>
      </section>
      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© 2025 COCOiRO Inc. All rights reserved.</p>
      </footer>
    </>
  )
}
