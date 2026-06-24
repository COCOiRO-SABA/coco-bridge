async function getCompanyInfo() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=会社情報`, { cache: 'no-store' })
    return await res.json()
  } catch (e) {
    return []
  }
}
export const metadata = {
  title: '会社情報｜COCO&Bridge',
  description: 'COCO&Bridge（株式会社COCOiRO）の会社概要・代表メッセージをご紹介します。',
}
export default async function AboutPage() {
  const info = await getCompanyInfo()
  const overview = info.filter(i => i['セクション'] === '会社概要')
  const message = info.find(i => i['セクション'] === '代表メッセージ')
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
        <h1>私たち<span>について</span></h1>
        <p>介護業界で培ったITとDXの知見を、すべての中小企業へ。</p>
      </section>
      <section className="section">
        <p className="section-subtitle">MESSAGE</p>
        <h2 className="section-title">代表メッセージ</h2>
        <p style={{ fontSize: '16px', lineHeight: '2', color: 'var(--gray-600)', maxWidth: '700px' }}>
          {message?.['内容']}
        </p>
      </section>
      <section style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-subtitle">COMPANY</p>
          <h2 className="section-title">会社概要</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '32px' }}>
            <tbody>
              {overview.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--navy)', fontWeight: '600', width: '200px', background: 'white' }}>
                    {item['項目名']}
                  </th>
                  <td style={{ padding: '16px 24px', color: 'var(--gray-600)' }}>
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
        <p>© 2025 COCOiRO Inc. All rights reserved.</p>
      </footer>
    </>
  )
}
