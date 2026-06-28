import FadeIn from './components/FadeIn'
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
      .sort((a, b) => Number(a['表示順']) - Number(b['表示順']))
  } catch (e) {
    return []
  }
}
async function getSections() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=セクション設定`, { cache: 'no-store' })
    const data = await res.json()
    const map = {}
    data.forEach(row => {
      map[row['セクションID']] = row['表示'] === true || row['表示'] === 'TRUE'
    })
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
async function getStaff() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=スタッフ`, { cache: 'no-store' })
    const data = await res.json()
    return data
      .filter(s => s['公開'] === true || s['公開'] === 'TRUE')
      .sort((a, b) => Number(a['表示順']) - Number(b['表示順']))
  } catch (e) {
    return []
  }
}
export default async function Home() {
  const [config, services, sections, news, staff] = await Promise.all([
    getSiteConfig(), getServices(), getSections(), getNews(), getStaff(),
  ])
  const navLinks = [
    { href: '/services', label: 'サービス', show: true },
    { href: '/about', label: '私たちについて', show: true },
    { href: '/staff', label: 'スタッフ', show: sections.staff },
    { href: '/recruit', label: '採用情報', show: sections.recruit },
    { href: '/blog', label: 'ブログ', show: true },
    { href: '/contact', label: 'お問い合わせ', show: true },
  ].filter(item => item.show)
  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">COCO<span>&</span>Bridge</a>
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.href}><a href={link.href}>{link.label}</a></li>
          ))}
        </ul>
      </nav>
      {/* ヒーロー */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-shape" />
          <div className="hero-shape" />
          <div className="hero-shape" />
        </div>
        <h1>{config.catch_copy || 'デジタルで、ビジネスの橋を架ける。'}</h1>
        <p>{config.sub_copy || '課題の本質から考える、DX伴走パートナー'}</p>
        <a href={config.cta_url || '/contact'} className="btn-primary">
          {config.cta_text || '無料相談はこちら'}
        </a>
        <a href="/services" className="btn-outline">サービスを見る</a>
      </section>
      {/* コンセプト */}
      {sections.concept !== false && (
        <section className="section">
          <FadeIn><p className="section-subtitle">CONCEPT</p></FadeIn>
          <FadeIn delay={1}>
            <h2 className="section-title">{config.concept_title || 'COCO&Bridgeについて'}</h2>
          </FadeIn>
          <FadeIn delay={2}>
            <p style={{ fontSize: '16px', lineHeight: '2', color: 'var(--gray-600)', maxWidth: '760px', whiteSpace: 'pre-line' }}>
              {config.concept_body}
            </p>
          </FadeIn>
        </section>
      )}
      {/* サービス */}
      {sections.services !== false && (
        <section style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <FadeIn><p className="section-subtitle">SERVICES</p></FadeIn>
            <FadeIn delay={1}><h2 className="section-title">サービス一覧</h2></FadeIn>
            <FadeIn>
              <div className="services-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '40px' }}>
                {services.map((service, i) => (
                  <div key={i} className="service-card-hover" style={{ background: 'white', borderRadius: '12px', padding: '36px 28px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,39,68,0.06)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--navy), var(--gold))' }} />
                    <p style={{ display: 'inline-block', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.12em', background: 'rgba(184,149,74,0.08)', padding: '4px 10px', borderRadius: '20px', marginBottom: '16px' }}>
                      {service['カテゴリ']}
                    </p>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--navy)', marginBottom: '12px', lineHeight: '1.4' }}>
                      {service['サービス名']}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.9' }}>
                      {service['キャッチコピー']}
                    </p>
                    {service['月額料金'] && (
                      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--gray-200)', fontSize: '13px', color: 'var(--gray-600)' }}>
                        月額 <strong style={{ fontSize: '22px', color: 'var(--navy)', fontWeight: '700' }}>
                          ¥{Number(service['月額料金']).toLocaleString()}
                        </strong> 〜
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <a href="/services" className="btn-primary">サービス詳細を見る</a>
            </div>
          </div>
        </section>
      )}
      {/* スタッフ紹介 */}
      {sections.staff && (
        <section className="section">
          <FadeIn><p className="section-subtitle">STAFF</p></FadeIn>
          <FadeIn delay={1}><h2 className="section-title">スタッフ紹介</h2></FadeIn>
          <FadeIn>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '40px' }}>
              {staff.map((member, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '28px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,39,68,0.06)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--navy), var(--gold))' }} />
                  {member['画像URL'] ? (
                    <img src={member['画像URL']} alt={member['名前']} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', margin: '0 auto 12px', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gray-200)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>👤</div>
                  )}
                  <div style={{ fontSize: '11px', color: 'var(--gold)', marginBottom: '4px' }}>{member['役職']}</div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--navy)', marginBottom: '8px' }}>{member['名前']}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray-600)', lineHeight: '1.7' }}>{member['自己紹介']}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a href="/staff" style={{ fontSize: '14px', color: 'var(--navy)', borderBottom: '1px solid var(--navy)', paddingBottom: '2px' }}>スタッフ一覧を見る →</a>
          </div>
        </section>
      )}
      {/* 代表プロフィール */}
      {sections.profile !== false && (
        <section style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <FadeIn><p className="section-subtitle">PROFILE</p></FadeIn>
            <FadeIn delay={1}><h2 className="section-title">代表プロフィール</h2></FadeIn>
            <FadeIn>
              <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '32px' }}>
                {config.profile_image ? (
                  <img src={config.profile_image} alt={config.profile_name} style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'var(--gray-200)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)', fontSize: '13px' }}>写真</div>
                )}
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <h3 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '12px' }}>{config.profile_name}</h3>
                  <p style={{ fontSize: '15px', lineHeight: '2', color: 'var(--gray-600)' }}>{config.profile_short}</p>
                  <a href="/about" style={{ display: 'inline-block', marginTop: '16px', fontSize: '14px', color: 'var(--gold)', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>詳しいプロフィールを見る →</a>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}
      {/* お客様の声 */}
      {sections.voice && (
        <section className="section">
          <FadeIn><p className="section-subtitle">VOICE</p></FadeIn>
          <FadeIn delay={1}><h2 className="section-title">お客様の声</h2></FadeIn>
          <FadeIn>
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-600)' }}>
              <p>お客様の声を準備中です。</p>
            </div>
          </FadeIn>
        </section>
      )}
      {/* お知らせ */}
      {sections.news !== false && news.length > 0 && (
        <section style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <FadeIn><p className="section-subtitle">NEWS</p></FadeIn>
            <FadeIn delay={1}><h2 className="section-title">お知らせ</h2></FadeIn>
            <div style={{ display: 'grid', gap: '12px', marginTop: '32px' }}>
              {news.map((post, i) => (
                <FadeIn key={i} delay={i + 1}>
                  <div style={{ background: 'white', borderRadius: '8px', padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{post['公開日']}</span>
                    <span style={{ fontSize: '12px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{post['カテゴリ']}</span>
                    <span style={{ fontSize: '15px', color: 'var(--navy)' }}>{post['タイトル']}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <a href="/blog" style={{ fontSize: '14px', color: 'var(--navy)', borderBottom: '1px solid var(--navy)', paddingBottom: '2px' }}>お知らせ一覧を見る →</a>
            </div>
          </div>
        </section>
      )}
      {/* アクセス */}
      {sections.access && (
        <section style={{ background: 'white', padding: '80px 40px', textAlign: 'center' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <FadeIn><p className="section-subtitle">ACCESS</p></FadeIn>
            <FadeIn delay={1}><h2 className="section-title">アクセス</h2></FadeIn>
            <FadeIn>
              <div style={{ marginTop: '24px' }}>
                <a href="/access" className="btn-primary">アクセス情報を見る</a>
              </div>
            </FadeIn>
          </div>
        </section>
      )}
      {/* 採用情報 */}
      {sections.recruit && (
        <section style={{ background: 'var(--gray-100)', padding: '80px 40px', textAlign: 'center' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <FadeIn><p className="section-subtitle">RECRUIT</p></FadeIn>
            <FadeIn delay={1}><h2 className="section-title">採用情報</h2></FadeIn>
            <FadeIn>
              <div style={{ marginTop: '24px' }}>
                <a href="/recruit" className="btn-primary">採用情報を見る</a>
              </div>
            </FadeIn>
          </div>
        </section>
      )}
      {/* CTA */}
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
      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
      </footer>
    </>
  )
        }
