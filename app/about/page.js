const GAS_API = process.env.NEXT_PUBLIC_GAS_API

async function getConfig() {
  try {
    const res = await fetch(`${GAS_API}?sheet=サイト全体設定`, { cache: 'no-store' })
    const data = await res.json()
    const config = {}
    data.forEach(row => { config[row['項目キー']] = row['値'] })
    return config
  } catch { return {} }
}

async function getCompanyInfo() {
  try {
    const res = await fetch(`${GAS_API}?sheet=会社情報`, { cache: 'no-store' })
    return await res.json()
  } catch { return [] }
}

export const metadata = {
  title: '私たちについて｜COCO&Bridge',
  description: 'COCO&Bridgeのコンセプト・代表プロフィール・会社概要をご紹介します。',
}

export default async function AboutPage() {
  const [config, overview] = await Promise.all([getConfig(), getCompanyInfo()])

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

      <section className="hero" style={{ padding: '60px 40px' }}>
        <h1>私たちに<span>ついて</span></h1>
        <p>{config.sub_copy || '介護業界と一般企業を繋ぐ、DX伴走パートナー。'}</p>
      </section>

      <section className="section">
        <p className="section-subtitle">CONCEPT</p>
        <h2 className="section-title">{config.concept_title || 'COCO&Bridgeについて'}</h2>
        <p style={{ fontSize: '16px', lineHeight: '2', color: 'var(--gray-600)', maxWidth: '760px', whiteSpace: 'pre-line', marginTop: '32px' }}>
          {config.concept_body}
        </p>
      </section>

      <section className="section" style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
        <p className="section-subtitle">PROFILE</p>
        <h2 className="section-title">代表プロフィール</h2>
        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', marginTop: '48px', flexWrap: 'wrap' }}>
          <img
            src={config.profile_image}
            alt={config.profile_name}
            style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h3 style={{ fontSize: '22px', color: 'var(--navy)', marginBottom: '8px' }}>{config.profile_name}</h3>
            <p style={{ fontSize: '15px', lineHeight: '2', color: 'var(--gray-600)', whiteSpace: 'pre-line' }}>
              {config.profile_body}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="section-subtitle">MESSAGE</p>
        <h2 className="section-title">代表メッセージ</h2>
        <p style={{ fontSize: '16px', lineHeight: '2.2', color: 'var(--gray-600)', maxWidth: '760px', whiteSpace: 'pre-line', marginTop: '32px' }}>
          {config.profile_message}
        </p>
