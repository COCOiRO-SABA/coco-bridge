import FadeIn from '../components/FadeIn'

const GAS_API = process.env.NEXT_PUBLIC_GAS_API

async function getSiteConfig() {
  const res = await fetch(`${GAS_API}?sheet=サイト全体設定`, { cache: 'no-store' })
  const data = await res.json()
  const config = {}
  data.forEach(row => { config[row['項目キー']] = row['値'] })
  return config
}

async function getStaff() {
  const res = await fetch(`${GAS_API}?sheet=スタッフ`, { cache: 'no-store' })
  const data = await res.json()
  return data
    .filter(s => s['公開'] === true || s['公開'] === 'TRUE')
    .sort((a, b) => Number(a['表示順']) - Number(b['表示順']))
}

export const metadata = {
  title: 'スタッフ | COCO&Bridge',
  description: 'COCO&Bridgeのスタッフ紹介です。',
}

export default async function StaffPage() {
  const [config, staff] = await Promise.all([getSiteConfig(), getStaff()])

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">COCO<span>&</span>Bridge</a>
        <ul className="nav-links">
          <li><a href="/services">サービス</a></li>
          <li><a href="/about">私たちについて</a></li>
          <li><a href="/staff">スタッフ</a></li>
          <li><a href="/news">お知らせ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
      </nav>

      <section style={{ background: 'var(--navy)', padding: '80px 40px 64px', textAlign: 'center' }}>
        <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>STAFF</p>
        <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'white', marginTop: '8px' }}>スタッフ紹介</h1>
      </section>

      <section className="section">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          {staff.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray-600)' }}>スタッフ情報は準備中です。</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
              {staff.map((member, i) => (
                <FadeIn key={i} delay={i % 3}>
                  <div style={{
                    background: 'white', borderRadius: '16px', padding: '36px 28px',
                    boxShadow: '0 2px 16px rgba(26,39,68,0.07)', textAlign: 'center',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #1a2744, #b8954a)' }} />
                    {member['画像URL'] ? (
                      <img
                        src={member['画像URL']}
                        alt={member['名前']}
                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '16px' }}
                      />
                    ) : (
                      <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1a2744, #b8954a)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: '32px', color: 'white', fontWeight: '700',
                      }}>
                        {member['名前']?.charAt(0)}
                      </div>
                    )}
                    <p style={{ fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '6px' }}>{member['役職']}</p>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--navy)', marginBottom: '16px' }}>{member['名前']}</h2>
                    <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.9', textAlign: 'left' }}>{member['自己紹介']}</p>
                    {member['メモ'] && (
                      <p style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '12px', fontStyle: 'italic' }}>{member['メモ']}</p>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          )}

          <FadeIn>
            <div style={{ textAlign: 'center', marginTop: '56px' }}>
              <a href="/contact" className="btn-primary">お問い合わせはこちら</a>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
      </footer>
    </>
  )
}
