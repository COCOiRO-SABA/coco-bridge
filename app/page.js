import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

async function getServices() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_SERVICES_DB,
      filter: {
        property: '公開フラグ',
        checkbox: { equals: true },
      },
      sorts: [{ property: '表示順', direction: 'ascending' }],
    })
    return response.results
  } catch (e) {
    console.error('Notion error:', e)
    return []
  }
}

export default async function Home() {
  const services = await getServices()

  return (
    <>
      {/* ナビゲーション */}
      <nav className="nav">
        <div className="nav-logo">
          COCO<span>&</span>Bridge
        </div>
        <ul className="nav-links">
          <li><a href="#services">サービス</a></li>
          <li><a href="#about">私たちについて</a></li>
          <li><a href="/blog">ブログ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
      </nav>

      {/* ヒーロー */}
      <section className="hero">
        <h1>
          デジタルで、<span>ビジネスの橋</span>を架ける。
        </h1>
        <p>
          ウェブ制作・SNS運用・DX支援を通じて、<br />
          中小企業のデジタル化を一緒に進めます。
        </p>
        <a href="/contact" className="btn-primary">無料相談はこちら</a>
        <a href="#services" className="btn-outline">サービスを見る</a>
      </section>

      {/* サービス一覧 */}
      <section className="section" id="services">
        <p className="section-subtitle">SERVICES</p>
        <h2 className="section-title">サービス一覧</h2>

        <div className="services-grid">
          {services.length > 0 ? (
            services.map((service) => {
              const props = service.properties
              const name = props['サービス名']?.title?.[0]?.plain_text ?? ''
              const category = props['カテゴリ']?.select?.name ?? ''
              const catch_copy = props['キャッチコピー']?.rich_text?.[0]?.plain_text ?? ''
              const price = props['月額料金']?.number ?? null

              return (
                <div key={service.id} className="service-card">
                  <p className="service-card-category">{category}</p>
                  <h3>{name}</h3>
                  <p>{catch_copy}</p>
                  {price && (
                    <div className="service-card-price">
                      月額 <strong>¥{price.toLocaleString()}</strong> 〜
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <p style={{ color: 'var(--gray-600)' }}>サービス情報を準備中です。</p>
          )}
        </div>
      </section>

      {/* CTAセクション */}
      <section style={{ background: 'var(--gray-100)', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', color: 'var(--navy)', marginBottom: '16px' }}>
          まずはお気軽にご相談ください
        </h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>
          貴社の課題をヒアリングし、最適なプランをご提案します。
        </p>
        <a href="/contact" className="btn-primary">無料相談・お問い合わせ</a>
      </section>

      {/* フッター */}
      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© 2025 COCOiRO Inc. All rights reserved.</p>
      </footer>
    </>
  )
}
