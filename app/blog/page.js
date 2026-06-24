async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_API}?sheet=お知らせ`, { cache: 'no-store' })
    const data = await res.json()
    return data.filter(p => p['ステータス'] === '公開')
  } catch (e) {
    return []
  }
}
export const metadata = {
  title: 'ブログ・お知らせ｜COCO&Bridge',
  description: 'デジタル活用のヒントやCOCO&Bridgeからのお知らせをお届けします。',
}
export default async function BlogPage() {
  const posts = await getPosts()
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
        <h1>ブログ・<span>お知らせ</span></h1>
        <p>デジタル活用のヒントや最新情報をお届けします。</p>
      </section>
      <section className="section">
        {posts.length > 0 ? (
          <div style={{ display: 'grid', gap: '24px' }}>
            {posts.map((post, i) => (
              <div key={i} style={{ border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 10px', borderRadius: '20px' }}>
                      {post['カテゴリ']}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--gray-600)' }}>{post['公開日']}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '8px' }}>{post['タイトル']}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.8' }}>{post['本文']}</p>
                </div>
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
        <p>© 2025 COCOiRO Inc. All rights reserved.</p>
      </footer>
    </>
  )
}
