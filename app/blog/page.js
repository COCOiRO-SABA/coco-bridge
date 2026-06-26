import { cache } from 'react'

const GAS_API = process.env.NEXT_PUBLIC_GAS_API

async function getConfig() {
  const res = await fetch(`${GAS_API}?sheet=サイト全体設定`, { cache: 'no-store' })
  const data = await res.json()
  const config = {}
  data.forEach(row => { config[row['項目キー']] = row['値'] })
  return config
}

async function getPosts() {
  const res = await fetch(`${GAS_API}?sheet=お知らせ`, { cache: 'no-store' })
  const data = await res.json()
  return data.filter(p => p['ステータス'] === '公開')
}

export const metadata = {
  title: 'ブログ・お知らせ｜COCO&Bridge',
  description: 'COCO&Bridgeからの最新情報やコラムをお届けします。',
}

export default async function BlogPage() {
  const [config, posts] = await Promise.all([getConfig(), getPosts()])

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
        <p>最新情報やコラムをお届けします。</p>
      </section>

      <section className="section">
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-600)', padding: '60px 0' }}>
            現在、記事はありません。
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
            {posts.map((post, i) => (
              <article key={i} style={{
                borderBottom: '1px solid var(--gray-200)',
                paddingBottom: '32px',
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginBottom: '12px' }}>
                  <time style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>
                    {post['日付']}
                  </time>
                  {post['カテゴリ'] && (
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--gold)',
                      border: '1px solid var(--gold)',
                      padding: '2px 10px',
                      borderRadius: '2px',
                      whiteSpace: 'nowrap',
                    }}>
                      {post['カテゴリ']}
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--navy)', lineHeight: '1.6', marginBottom: '12px' }}>
                  {post['タイトル']}
                </h2>
                {post['本文'] && (
                  <p style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: '1.8' }}>
                    {post['本文'].substring(0, 120)}{post['本文'].length > 120 ? '…' : ''}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section" style={{ background: 'var(--navy)', color: 'white', textAlign: 'center' }}>
        <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>CONTACT</p>
        <h2 className="section-title" style={{ color: 'white' }}>お問い合わせ</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
          {config.cta_text || 'まずはお気軽にご相談ください。'}
        </p>
        <a href={config.cta_url || '/contact'} className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>
          お問い合わせはこちら
        </a>
      </section>

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
      </footer>
    </>
  )
}
