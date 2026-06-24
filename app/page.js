async function getServices() {
  try {
    const url = `${process.env.NEXT_PUBLIC_GAS_API}?sheet=サービス`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return data.filter(s => s['公開'] === true || s['公開'] === 'TRUE');
  } catch (e) {
    console.error('GAS error:', e);
    return [];
  }
}

export default async function Home() {
  const services = await getServices();
  return (
    <>
      <nav className="nav">
        <div className="nav-logo">COCO<span>&</span>Bridge</div>
        <ul className="nav-links">
          <li><a href="#services">サービス</a></li>
          <li><a href="#about">私たちについて</a></li>
          <li><a href="/blog">ブログ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
      </nav>
      <section className="hero">
        <h1>デジタルで、<span>ビジネスの橋</span>を架ける。</h1>
        <p>ウェブ制作・SNS運用・DX支援を通じて、<br />中小企業のデジタル化を一緒に進めます。</p>
        <a href="/contact" className="btn-primary">無料相談はこちら</a>
        <a href="#services" className="btn-outline">サービスを見る</a>
      </section>
      <section className="section" id="services">
        <p className="section-subtitle">SERVICES</p>
        <h2 className="section-title">サービス一覧</h2>
        <div className="services-grid">
          {services.length > 0 ? (
            services.map((service, i) => (
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
            ))
          ) : (
            <p style={{ color: 'var(--gray-600)' }}>サービス情報を準備中です。</p>
          )}
        </div>
      </section>
      <section style={{ background: 'var(--gray-100)', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', color: 'var(--navy)', marginBottom: '16px' }}>まずはお気軽にご相談ください</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>貴社の課題をヒアリングし、最適なプランをご提案します。</p>
        <a href="/contact" className="btn-primary">無料相談・お問い合わせ</a>
      </section>
      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© 2025 COCOiRO Inc. All rights reserved.</p>
      </footer>
    </>
  );
            }
