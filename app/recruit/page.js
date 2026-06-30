import FadeIn from '../components/FadeIn'

const GAS_API = process.env.NEXT_PUBLIC_GAS_API

async function getSiteConfig() {
  const res = await fetch(`${GAS_API}?sheet=サイト全体設定`, { cache: 'no-store' })
  const data = await res.json()
  const config = {}
  data.forEach(row => { config[row['項目キー']] = row['値'] })
  return config
}

async function getJobs() {
  const res = await fetch(`${GAS_API}?sheet=採用情報`, { cache: 'no-store' })
  const data = await res.json()
  return data.filter(j => j['公開'] === true || j['公開'] === 'TRUE')
}

export const metadata = {
  title: '採用情報 | COCO&Bridge',
  description: 'COCO&Bridgeの採用情報です。一緒に働くメンバーを募集しています。',
}

export default async function RecruitPage() {
  const [config, jobs] = await Promise.all([getSiteConfig(), getJobs()])

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">COCO<span>&</span>Bridge</a>
        <ul className="nav-links">
          <li><a href="/services">サービス</a></li>
          <li><a href="/about">私たちについて</a></li>
          <li><a href="/staff">スタッフ</a></li>
          <li><a href="/news">お知らせ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
      </nav>

      <section style={{ background: 'var(--navy)', padding: '80px 40px 64px', textAlign: 'center' }}>
        <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>RECRUIT</p>
        <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'white', marginTop: '8px' }}>採用情報</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '16px', fontSize: '16px' }}>
          COCO&Bridgeで一緒に働きませんか？
        </p>
      </section>

      <section className="section">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {jobs.length === 0 ? (
            <FadeIn>
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-600)' }}>
                <p style={{ fontSize: '16px', marginBottom: '8px' }}>現在、募集中のポジションはありません。</p>
                <p style={{ fontSize: '14px' }}>今後の求人情報は随時更新いたします。</p>
              </div>
            </FadeIn>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              {jobs.map((job, i) => (
                <FadeIn key={i} delay={i}>
                  <div style={{
                    background: 'white', borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(26,39,68,0.07)',
                    overflow: 'hidden',
                  }}>
                    <div style={{ background: 'linear-gradient(90deg, #1a2744, #b8954a)', padding: '20px 28px' }}>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', letterSpacing: '0.08em' }}>
                        {job['雇用形態']}
                      </p>
                      <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>{job['職種名']}</h2>
                    </div>
                    <div style={{ padding: '24px 28px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <tbody>
                          {[
                            { label: '業務内容', value: job['業務内容'] },
                            { label: '応募条件', value: job['応募条件'] },
                            { label: '給与', value: job['給与'] },
                            { label: '勤務地', value: job['勤務地'] },
                          ].filter(r => r.value).map((row, j) => (
                            <tr key={j} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                              <th style={{
                                width: '100px', padding: '14px 12px 14px 0',
                                fontWeight: '700', color: 'var(--navy)',
                                verticalAlign: 'top', textAlign: 'left', whiteSpace: 'nowrap',
                              }}>
                                {row.label}
                              </th>
                              <td style={{ padding: '14px 0', color: 'var(--gray-600)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                                {row.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ marginTop: '20px' }}>
                        <a href="/contact" className="btn-primary" style={{ fontSize: '14px', padding: '10px 28px' }}>
                          この求人に応募する
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}

          <FadeIn>
            <div style={{
              marginTop: '56px', background: 'var(--gray-100)',
              borderRadius: '12px', padding: '32px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '15px', color: 'var(--navy)', fontWeight: '600', marginBottom: '8px' }}>
                気になることがあればお気軽にご連絡ください
              </p>
              <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '24px' }}>
                募集職種以外でもご相談をお受けしています。
              </p>
              <a href="/contact" className="btn-primary">お問い合わせはこちら</a>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
      </footer>
    </>
  )
}
