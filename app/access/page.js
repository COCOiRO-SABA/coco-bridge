import FadeIn from '../components/FadeIn'

const GAS_API = process.env.NEXT_PUBLIC_GAS_API

async function getSiteConfig() {
  const res = await fetch(`${GAS_API}?sheet=サイト全体設定`, { cache: 'no-store' })
  const data = await res.json()
  const config = {}
  data.forEach(row => { config[row['項目キー']] = row['値'] })
  return config
}

async function getAccess() {
  const res = await fetch(`${GAS_API}?sheet=アクセス`, { cache: 'no-store' })
  const data = await res.json()
  const access = {}
  data.forEach(row => { access[row['項目キー']] = row['値'] })
  return access
}

export const metadata = {
  title: 'アクセス | COCO&Bridge',
  description: 'COCO&Bridgeへのアクセス情報です。',
}

const ACCESS_LABELS = {
  address: '住所',
  nearest_station: '最寄り駅',
  business_hours: '営業時間',
  closed_day: '定休日',
  parking: '駐車場',
  tel: '電話番号',
}

export default async function AccessPage() {
  const [config, access] = await Promise.all([getSiteConfig(), getAccess()])

  const rows = Object.entries(ACCESS_LABELS)
    .filter(([key]) => access[key])
    .map(([key, label]) => ({ label, value: access[key] }))

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">COCO<span>&</span>Bridge</a>
        <ul className="nav-links">
          <li><a href="/services">サービス</a></li>
          <li><a href="/about">私たちについて</a></li>
          <li><a href="/staff">スタッフ</a></li>
          <li><a href="/blog">ブログ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
      </nav>

      <section style={{ background: 'var(--navy)', padding: '80px 40px 64px', textAlign: 'center' }}>
        <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>ACCESS</p>
        <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'white', marginTop: '8px' }}>アクセス</h1>
      </section>

      <section className="section">
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <FadeIn>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <th style={{
                      width: '140px', padding: '20px 16px 20px 0',
                      fontWeight: '700', color: 'var(--navy)',
                      verticalAlign: 'top', textAlign: 'left', whiteSpace: 'nowrap',
                    }}>
                      {row.label}
                    </th>
                    <td style={{ padding: '20px 0', color: 'var(--gray-600)', lineHeight: '1.8' }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>

          {access.map_url && (
            <FadeIn delay={1}>
              <div style={{ marginTop: '48px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,39,68,0.08)' }}>
                <iframe
                  src={access.map_url}
                  width="100%"
                  height="400"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>
          )}

          <FadeIn delay={2}>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
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
