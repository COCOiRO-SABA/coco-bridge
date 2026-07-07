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

async function getFaq() {
  const res = await fetch(`${GAS_API}?sheet=よくある質問`, { cache: 'no-store' })
  const data = await res.json()
  return data.filter(f => f['公開'] === true || f['公開'] === 'TRUE').sort((a, b) => a['表示順'] - b['表示順'])
}

async function getPricing() {
  const res = await fetch(`${GAS_API}?sheet=料金表`, { cache: 'no-store' })
  const data = await res.json()
  return data.filter(p => p['公開'] === true || p['公開'] === 'TRUE').sort((a, b) => a['表示順'] - b['表示順'])
}

async function getSchedule() {
  const res = await fetch(`${GAS_API}?sheet=1日の流れ`, { cache: 'no-store' })
  const data = await res.json()
  return data.filter(s => s['公開'] === true || s['公開'] === 'TRUE').sort((a, b) => a['表示順'] - b['表示順'])
}

async function getAvailability() {
  const res = await fetch(`${GAS_API}?sheet=空き情報`, { cache: 'no-store' })
  const data = await res.json()
  return data.filter(a => a['公開'] === true || a['公開'] === 'TRUE').sort((a, b) => a['表示順'] - b['表示順'])
}

export const metadata = {
  title: 'COCO&Bridge | 中小企業のデジタル伴走パートナー',
  description: 'ウェブ制作・SNS運用・業務自動化・DX推進を一気通貫で伴走するDXパートナー。',
}

export default async function Home() {
  const [config, services, sections, news, faq, pricing, schedule, availability] = await Promise.all([
    getSiteConfig(), getServices(), getSections(), getNews(),
    getFaq(), getPricing(), getSchedule(), getAvailability()
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
          <p className="hero-sub">{config.catch_copy}</p>
          <h1>{config.site_name || 'COCO&Bridge'}</h1>
          <p className="hero-desc">{config.sub_copy}</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <a href={config.cta_url || '/contact'} className="btn-primary">{config.cta_text || '無料相談はこちら'}</a>
            <a href="/services" className="btn-outline">サービスを見る</a>
          </div>
                  <div className="hero-scroll-indicator">SCROLL</div>
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
            <a href="/news" style={{ fontSize: '14px', color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>
              お知らせ一覧を見る →
            </a>
          </div>
        </section>
      )}

      {sections.pricing !== false && pricing.length > 0 && (
        <section className="section">
          <p className="section-subtitle">PRICING</p>
          <h2 className="section-title">料金プラン</h2>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '48px' }}>
            {pricing.map((plan, i) => {
              const isRec = plan['おすすめ'] === true || plan['おすすめ'] === 'TRUE'
              return (
                <div key={i} style={{
                  background: isRec ? 'var(--navy)' : 'white',
                  color: isRec ? 'white' : 'var(--navy)',
                  border: '2px solid var(--navy)',
                  borderRadius: '12px',
                  padding: '40px 32px',
                  flex: '1',
                  minWidth: '240px',
                  maxWidth: '340px',
                  position: 'relative'
                }}>
                  {isRec && (
                    <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: 'white', fontSize: '12px', padding: '4px 16px', borderRadius: '99px', whiteSpace: 'nowrap' }}>おすすめ</span>
                  )}
                  <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{plan['プラン名']}</h3>
                  <p style={{ fontSize: '36px', fontWeight: '700', margin: '16px 0 4px' }}>
                    ¥{Number(plan['価格']).toLocaleString()}
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>/{plan['単位']}</span>
                  </p>
                  <p style={{ fontSize: '14px', opacity: '0.75', marginBottom: '24px', lineHeight: '1.6' }}>{plan['説明']}</p>
                  <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
                    {(plan['特徴'] || '').split('/').map((f, j) => (
                      <li key={j} style={{ padding: '8px 0', borderBottom: `1px solid ${isRec ? 'rgba(255,255,255,0.15)' : 'var(--gray-200)'}`, display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--gold)' }}>✓</span>{f.trim()}
                      </li>
                    ))}
                  </ul>
                  <a href={config.cta_url || '/contact'} className={isRec ? 'btn-primary' : 'btn-outline'} style={{ display: 'block', marginTop: '32px', textAlign: 'center', ...(isRec ? {} : { borderColor: 'var(--navy)', color: 'var(--navy)' }) }}>
                    このプランで相談する
                  </a>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {sections.schedule !== false && schedule.length > 0 && (
        <section className="section" style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
          <p className="section-subtitle">FLOW</p>
          <h2 className="section-title">1日の流れ</h2>
          <div style={{ maxWidth: '640px', margin: '48px auto 0' }}>
            {schedule.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ background: 'var(--navy)', color: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', minWidth: '72px', textAlign: 'center', flexShrink: 0 }}>
                  {item['時間']}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', color: 'var(--navy)', marginBottom: '6px', fontWeight: '600' }}>{item['タイトル']}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.7' }}>{item['説明']}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {sections.availability !== false && availability.length > 0 && (
        <section className="section">
          <p className="section-subtitle">AVAILABILITY</p>
          <h2 className="section-title">空き情報</h2>
          <div style={{ overflowX: 'auto', marginTop: '48px' }}>
            <table style={{ width: '100%', maxWidth: '600px', margin: '0 auto', borderCollapse: 'collapse', fontSize: '15px' }}>
              <thead>
                <tr style={{ background: 'var(--navy)', color: 'white' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>曜日</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>午前</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>午後</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>備考</th>
                </tr>
              </thead>
              <tbody>
                {availability.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--gray-200)', background: i % 2 === 0 ? 'white' : 'var(--gray-100)' }}>
                    <td style={{ padding: '12px 20px', textAlign: 'center', fontWeight: '600', color: 'var(--navy)' }}>{row['曜日']}</td>
                    <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: '18px', color: row['午前'] === '○' ? 'var(--gold)' : '#e55' }}>{row['午前']}</td>
                    <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: '18px', color: row['午後'] === '○' ? 'var(--gold)' : '#e55' }}>{row['午後']}</td>
                    <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--gray-600)' }}>{row['備考']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {sections.faq !== false && faq.length > 0 && (
        <section className="section" style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
          <p className="section-subtitle">FAQ</p>
          <h2 className="section-title">よくある質問</h2>
          <div style={{ maxWidth: '760px', margin: '48px auto 0' }}>
            {faq.map((item, i) => (
              <details key={i} style={{ borderBottom: '1px solid var(--gray-200)', padding: '20px 0' }}>
                <summary style={{ fontSize: '16px', color: 'var(--navy)', fontWeight: '600', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Q. {item['質問']}</span>
                  <span style={{ fontSize: '20px', color: 'var(--gold)', flexShrink: 0, marginLeft: '16px' }}>＋</span>
                </summary>
                <p style={{ marginTop: '16px', fontSize: '15px', color: 'var(--gray-600)', lineHeight: '1.8', paddingLeft: '8px' }}>
                  A. {item['回答']}
                </p>
              </details>
            ))}
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
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
      </footer>
    </>
  )
}
