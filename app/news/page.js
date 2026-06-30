function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return String(value)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

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
  title: 'お知らせ｜COCO&Bridge',
  description: 'COCO&Bridgeからのお知らせをお届けします。',
}

export default async function NewsPage() {
  const [posts, config] = await Promise.all([getPosts(), getConfig()])

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
        <h1>お知らせ</h1>
        <p>COCO&Bridgeからの最新情報をお届けします。</p>
      </section>

      <section className="section">
        {posts.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {posts.map((post, i) => (
              <a
                key={i}
                href={`/news/${post['スラッグ']}`}
                className="service-card-hover"
                style={{ textDecoration: 'none', border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '24px', display: 'block' }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                    {post['カテゴリ']}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{formatDate(post['公開日'])}</span>
                </div>
                <h3 style={{ fontSize: '17px', color: 'var(--navy)', marginBottom: '8px' }}>{post['タイトル']}</h3>
                <p style={{
                  fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.8',
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {post['本文']}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-600)' }}>
            <p>現在、お知らせはありません。</p>
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
      </footer>
    </>
  )
}
