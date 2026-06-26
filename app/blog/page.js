async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=お知らせ`, { cache: 'no-store' })
    const data = await res.json()
    return data.filter(p => p['ステータス'] === '公開')
  } catch (e) {
    return []
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
  title: 'ブログ・お知らせ｜COCO&Bridge',
  description: 'デジタル活用のヒントやCOCO&Bridgeからのお知らせをお届けします。',
}
export default async function BlogPage() {
  const [posts, config] = await Promise.all([getPosts(), getConfig()])
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
        <h1>ブログ・<span>お知らせ</span></h1>
        <p>デジタル活用のヒントや最新情報をお届けします。</p>
      </section>
      <section className="section">
        {posts.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {posts.map((post, i) => (
              <div key={i} style={{ border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{post['公開日']}</span>
                <span style={{ fontSize: '12px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{post['カテゴリ']}</span>
                <span style={{ fontSize: '15px', color: 'var(--navy)' }}>{post['タイトル']}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-600)' }}>
            <p>現在、記事を準備中です。しばらくお待ちください。</p>
          </div>
        )}
      </section>
      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge / 田村 恵'}</p>
      </footer>
    </>
  )
}
