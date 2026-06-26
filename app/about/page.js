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
async function getCompanyInfo() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=会社情報`, { cache: 'no-store' })
    return await res.json()
  } catch (e) {
    return []
  }
}
export const metadata = {
  title: '私たちについて｜COCO&Bridge',
  description: 'COCO&Bridgeのコンセプト・代表プロフィール・会社概要をご紹介します。',
}
export default async function AboutPage() {
  const [config, info] = await Promise.all([getConfig(), getCompanyInfo()])
  const overview = info.filter(i => i['セクション'] === '会社概要')
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
        <h1>私たち<span>について</span></h1>
        <p>介護業界と一般企業を繋ぐ、DX伴走パートナー。</p>
      </section>
      <section className="section">
        <p className="section-subtitle">CONCEPT</p>
        <h2 className="section-title">{config.concept_title || 'COCO&Bridgeについて'}</h2>
        <p style={{ fontSize: '16px', lineHeight: '2', color: 'var(--gray-600)', maxWidth: '760px', whiteSpace: 'pre-line' }}>
          {config.concept_body}
        </p>
      </section>
      <section style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-subtitle">PROFILE</p>
          <h2 className="section-title">代表プロフィール</h2>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '32px' }}>
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
        </div>
      </section>
      <section className="section">
        <p className="section-subtitle">MESSAGE</p>
        <h2 className="section-title">代表メッセージ</h2>
        <p style={{ fontSize: '16px', lineHeight: '2.2', color: 'var(--gray-600)', maxWidth: '760px', whiteSpace: 'pre-line', marginTop: '32px' }}>
          {config.profile_message}
        </p>
      </section>
      <section style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-subtitle">COMPANY</p>
          <h2 className="section-title">会社概要</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '32px', maxWidth: '760px' }}>
            <tbody>
              {overview.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--navy)', fontWeight: '600', width: '200px', background: 'white' }}>
                    {item['項目名']}
                  </th>
                  <td style={{ padding: '16px 24px', color: 'var(--gray-600)', background: 'white' }}>
                    {item['内容']}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
      </footer>
    </>
  )
}
