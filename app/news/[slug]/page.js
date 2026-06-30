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

export default async function NewsDetailPage({ params }) {
  const [posts, config] = await Promise.all([getPosts(), getConfig()])
  const post = posts.find(p => p['スラッグ'] === params.slug)

  if (!post) {
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
        <section className="section" style={{ textAlign: 'center', padding: '120px 40px' }}>
          <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>お知らせが見つかりませんでした。</p>
          <a href="/news" className="btn-primary">お知らせ一覧に戻る</a>
        </section>
        <footer className="footer">
          <div className="footer-logo">COCO<span>&</span>Bridge</div>
          <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
        </footer>
      </>
    )
  }

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

      <section className="section" style={{ maxWidth: '760px' }}>
        <a href="/news" style={{ fontSize: '13px', color: 'var(--gray-600)', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
          ← お知らせ一覧に戻る
        </a>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 10px', borderRadius: '20px' }}>
            {post['カテゴリ']}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{post['公開日']}</span>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--navy)', marginBottom: '32px', lineHeight: '1.5' }}>
          {post['タイトル']}
        </h1>

        {post['サムネイルURL'] && (
          <img
            src={post['サムネイルURL']}
            alt={post['タイトル']}
            style={{ width: '100%', borderRadius: '8px', marginBottom: '32px' }}
          />
        )}

        <div style={{ fontSize: '15px', color: 'var(--gray-700)', lineHeight: '2', whiteSpace: 'pre-line' }}>
          {post['本文']}
        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--gray-200)' }}>
          <a href="/news" className="btn-outline" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }}>
            お知らせ一覧に戻る
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
      </footer>
    </>
  )
}
