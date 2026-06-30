async function getAccess() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=アクセス`, { cache: 'no-store' })
    const data = await res.json()
    const access = {}
    data.forEach(row => { access[row['項目キー']] = row['値'] })
    return access
  } catch (e) {
    return {}
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
  title: 'アクセス｜COCO&Bridge',
}
export default async function AccessPage() {
  const [access, config] = await Promise.all([getAccess(), getConfig()])
  const extractMapSrc = (value) => {
    if (!value) return null
    if (value.startsWith('http')) return value
    const match = value.match(/src="([^"]+)"/)
    return match ? match[1] : null
  }
  const mapSrc = extractMapSrc(access.map_url)
  const tableItems = [
    { label: '住所', value: access.address, show: !!access.address },
    { label: '最寄り駅', value: access.nearest_station, show: access.show_station !== 'FALSE' && !!access.nearest_station },
    { label: '営業時間', value: access.business_hours, show: access.show_hours !== 'FALSE' && !!access.business_hours },
    { label: '駐車場', value: access.parking, show: access.show_parking !== 'FALSE' && !!access.parking },
    { label: '電話番号', value: access.tel, show: !!access.tel },
    { label: 'FAX', value: access.fax, show: !!access.fax },
    { label: 'メール', value: access.email, show: !!access.email },
    { label: 'アクセス方法', value: access.access_note, show: !!access.access_note },
  ].filter(item => item.show)
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
        <div className="hero-bg">
          <div className="hero-shape" /><div className="hero-shape" /><div className="hero-shape" />
        </div>
        <h1>アクセス<span>情報</span></h1>
        <p>{access.hero_message || 'お気軽にお問い合わせください。'}</p>
      </section>
      <section className="section">
        {access.visit_message && (
          <div style={{ background: 'rgba(184,149,74,0.08)', border: '1px solid var(--gold)', borderRadius: '8px', padding: '16px 20px', marginBottom: '40px', fontSize: '14px', color: 'var(--navy)', lineHeight: '1.7' }}>
            💡 {access.visit_message}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', flexWrap: 'wrap' }}>
          <div>
            <p className="section-subtitle">ACCESS</p>
            <h2 className="section-title">所在地・営業情報</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '24px' }}>
              <tbody>
                {tableItems.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--gray-200)' }}>
