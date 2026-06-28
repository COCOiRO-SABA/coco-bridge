import FadeIn from './components/FadeIn'

const GAS_API = process.env.NEXT_PUBLIC_GAS_API

async function getSiteConfig() {
  try {
    const res = await fetch(`${GAS_API}?sheet=サイト全体設定`, { cache: 'no-store' })
    const data = await res.json()
    const config = {}
    data.forEach(row => { config[row['項目キー']] = row['値'] })
    return config
  } catch (e) {
    return {}
  }
}

async function getSections() {
  try {
    const res = await fetch(`${GAS_API}?sheet=セクション設定`, { cache: 'no-store' })
    const data = await res.json()
    const sections = {}
    data.forEach(row => { sections[row['セクションID']] = row['表示'] })
    return sections
  } catch (e) {
    return {}
  }
}

async function getServices() {
  try {
    const res = await fetch(`${GAS_API}?sheet=サービス`, { cache: 'no-store' })
    return await res.json()
  } catch (e) {
    return []
  }
}

async function getNews() {
  try {
    const res = await fetch(`${GAS_API}?sheet=お知らせ`, { cache: 'no-store' })
    const data = await res.json()
    return data.slice(0, 3)
  } catch (e) {
    return []
  }
}

async function getStaff() {
  try {
    const res = await fetch(`${GAS_API}?sheet=スタッフ`, { cache: 'no-store' })
    const data = await res.json()
    return data
      .filter(s => s['公開'] === true || s['公開'] === 'TRUE')
      .sort((a, b) => Number(a['表示順']) - Number(b['表示順']))
  } catch (e) {
    return []
  }
}

export default async function Home() {
  const [config, sections, services, news, staff] = await Promise.all([
    getSiteConfig(),
    getSections(),
    getServices(),
    getNews(),
    getStaff(),
  ])

  const navLinks = [
    { label: 'サービス', href: '/services', always: true },
    { label: '私たちについて', href: '/about', always: true },
    { label: 'スタッフ', href: '/staff', key: 'staff' },
    { label: 'ブログ', href: '/blog', always: true },
    { label: '採用情報', href: '/recruit', key: 'recruit' },
    { label: 'お問い合わせ', href: '/contact', always: true },
  ].filter(l => l.always || sections[l.key])

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">COCO<span>&</span>Bridge</a>
        <ul className="nav-links">
          {navLinks.map(l => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      {sections.hero && (
        <section className="hero hero-bg">
          <FadeIn>
            <p className="section-subtitle">{config.hero_subtitle || 'DIGITAL PARTNER'}</p>
            <h1 className="hero-title">{config.catch_copy || 'デジタルで、前へ。'}</h1>
            <p className="hero-sub">{config.sub_copy || '中小企業のデジタル伴走パートナー'}</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={config.cta_url || '/contact'} className="btn-primary">{config.cta_text || 'お問い合わせはこちら'}</a>
              <a href="/services" className="btn-secondary">サービスを見る</a>
            </div>
          </FadeIn>
        </section>
      )}

      {/* CONCEPT */}
      {sections.concept && (
        <section className="section" style={{ background: 'var(--gray-100)' }}>
          <FadeIn>
            <p className="section-subtitle">CONCEPT</p>
            <h2 className="section-title">{config.about_title || '私たちについて'}</h2>
            <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--gray-600)', lineHeight: '2', fontSize: '16px', whiteSpace: 'pre-line' }}>
              {config.about_text || 'テキストを設定してください'}
            </p>
            <div style={{ marginTop: '32px' }}>
              <a href="/about" className="btn-primary">詳しく見る</a>
            </div>
          </FadeIn>
        </section>
      )}

      {/* SERVICES */}
      {sections.services && (
        <section className="section">
          <FadeIn>
            <p className="section-subtitle">SERVICES</p>
            <h2 className="section-title">サービス一覧</h2>
          </FadeIn>
          <div className="services-grid">
            {services.map((s, i) => (
              <FadeIn key={i} delay={i % 4}>
                <div className="service-card hover-lift">
                  <div className="service-card-line" />
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>{s['アイコン'] || '🔷'}</div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--navy)', marginBottom: '10px' }}>{s['サービス名']}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.8' }}>{s['説明']}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* STAFF */}
      {sections.staff && (
        <section className="section" style={{ background: 'var(--gray-100)' }}>
          <FadeIn>
            <p className="section-subtitle">STAFF</p>
            <h2 className="section-title">スタッフ紹介</h2>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px', maxWidth: '960px', margin: '0 auto' }}>
            {staff.map((member, i) => (
              <FadeIn key={i} delay={i % 3}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '32px 24px', boxShadow: '0 2px 12px rgba(26,39,68,0.07)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #1a2744, #b8954a)' }} />
                  {member['画像URL'] ? (
                    <img src={member['画像URL']} alt={member['名前']} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '12px' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a2744, #b8954a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '28px', color: 'white', fontWeight: '700' }}>
                      {member['名前']?.charAt(0)}
                    </div>
                  )}
                  <p style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '4px' }}>{member['役職']}</p>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--navy)' }}>{member['名前']}</h3>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <a href="/staff" className="btn-primary">スタッフ一覧を見る</a>
            </div>
          </FadeIn>
        </section>
      )}

      {/* PROFILE */}
      {sections.profile && (
        <section className="section">
          <FadeIn>
            <p className="section-subtitle">PROFILE</p>
            <h2 className="section-title">代表プロフィール</h2>
          </FadeIn>
          <FadeIn delay={1}>
            <div style={{ maxWidth: '720px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '48px', boxShadow: '0 4px 24px rgba(26,39,68,0.08)', display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 auto' }}>
                {config.profile_image ? (
                  <img src={config.profile_image} alt={config.profile_name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }} />
                ) : (
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--navy), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: 'white' }}>👤</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <p style={{ fontSize: '13px', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '4px' }}>{config.profile_title || '代表取締役'}</p>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy)', marginBottom: '16px' }}>{config.profile_name || '氏名未設定'}</h3>
                <p style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: '2', whiteSpace: 'pre-line' }}>{config.profile_bio}</p>
              </div>
            </div>
          </FadeIn>
        </section>
      )}

      {/* NEWS */}
      {sections.news && news.length > 0 && (
        <section className="section" style={{ background: 'var(--gray-100)' }}>
          <FadeIn>
            <p className="section-subtitle">NEWS</p>
            <h2 className="section-title">お知らせ</h2>
          </FadeIn>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {news.map((item, i) => (
              <FadeIn key={i} delay={i}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '20px 28px', marginBottom: '12px', boxShadow: '0 1px 6px rgba(26,39,68,0.06)', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'nowrap', paddingTop: '2px' }}>{item['日付']}</span>
                  <span style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: '600' }}>{item['タイトル']}</span>
                </div>
              </FadeIn>
            ))}
            <FadeIn>
              <div style={{ textAlign: 'center', marginTop: '28px' }}>
                <a href="/blog" className="btn-secondary">すべてのお知らせを見る</a>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ACCESS */}
      {sections.access && (
        <section className="section">
          <FadeIn>
            <p className="section-subtitle">ACCESS</p>
            <h2 className="section-title">アクセス</h2>
            <div style={{ marginTop: '32px' }}>
              <a href="/access" className="btn-primary">アクセス情報を見る</a>
            </div>
          </FadeIn>
        </section>
      )}

      {/* RECRUIT */}
      {sections.recruit && (
        <section className="section" style={{ background: 'var(--gray-100)' }}>
          <FadeIn>
            <p className="section-subtitle">RECRUIT</p>
            <h2 className="section-title">採用情報</h2>
            <p style={{ color: 'var(--gray-600)', marginTop: '16px', marginBottom: '32px' }}>COCO&amp;Bridgeで一緒に働きませんか？</p>
            <a href="/recruit" className="btn-primary">採用情報を見る</a>
          </FadeIn>
        </section>
      )}

      {/* CTA */}
      {sections.cta && (
        <section className="section" style={{ background: 'var(--navy)', textAlign: 'center' }}>
          <FadeIn>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>CONTACT</p>
            <h2 className="section-title" style={{ color: 'white' }}>まずはお気軽にご相談ください</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', fontSize: '16px' }}>
              {config.cta_description || 'お客様のビジネス課題に合わせたご提案をいたします。'}
            </p>
            <a href={config.cta_url || '/contact'} className="btn-primary" style={{ background: 'var(--gold)', borderColor: 'var(--gold)' }}>
              {config.cta_text || 'お問い合わせはこちら'}
            </a>
          </FadeIn>
        </section>
      )}

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <ul className="footer-links">
          <li><a href="/privacy">プライバシーポリシー</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
      </footer>
    </>
  )
            }
