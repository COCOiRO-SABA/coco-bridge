import FadeIn from './components/FadeIn'

const GAS_API = process.env.NEXT_PUBLIC_GAS_API

async function getSiteConfig() {
const res = await fetch(`${GAS_API}?sheet=サイト全体設定`, { cache: 'no-store' })
const data = await res.json()
const config = {}
data.forEach(row => { config[row['項目キー']] = row['値'] })
return config
}

async function getServices() {
const res = await fetch(`${GAS_API}?sheet=サービス`, { cache: 'no-store' })
const data = await res.json()
return data.filter(s => s['公開'] === true || s['公開'] === 'TRUE' || s['公開'] === '公開')
}

async function getSections() {
const res = await fetch(`${GAS_API}?sheet=セクション設定`, { cache: 'no-store' })
const data = await res.json()
const sections = {}
data.forEach(row => {
sections[row['セクションID']] = row['表示'] === true || row['表示'] === 'TRUE'
})
return sections
}

async function getNews() {
const res = await fetch(`${GAS_API}?sheet=お知らせ`, { cache: 'no-store' })
const data = await res.json()
return data.filter(n => n['ステータス'] === '公開').slice(0, 3)
}

async function getStaff() {
const res = await fetch(`${GAS_API}?sheet=スタッフ`, { cache: 'no-store' })
const data = await res.json()
return data
.filter(s => s['公開'] === true || s['公開'] === 'TRUE')
.sort((a, b) => Number(a['表示順']) - Number(b['表示順']))
.slice(0, 3)
}

async function getAccess() {
const res = await fetch(`${GAS_API}?sheet=アクセス`, { cache: 'no-store' })
const data = await res.json()
const access = {}
data.forEach(row => { access[row['項目キー']] = row['値'] })
return access
}

export const metadata = {
title: 'COCO&Bridge | 中小企業のデジタル伴走パートナー',
description: 'ウェブ制作・SNS運用・業務自動化・DX推進を一気通貫で伴走するDXパートナー。',
}

const ACCESS_LABELS = {
address: '住所',
nearest_station: '最寄り駅',
business_hours: '営業時間',
closed_day: '定休日',
parking: '駐車場',
tel: '電話番号',
}

export default async function Home() {
const [config, services, sections, news, staff, access] = await Promise.all([
getSiteConfig(), getServices(), getSections(), getNews(), getStaff(), getAccess()
])

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

{sections.hero !== false && (
<section className="hero">
<div className="hero-bg">
<div className="hero-shape" />
<div className="hero-shape" />
<div className="hero-shape" />
</div>
<p className="hero-sub">{config.catch_copy}</p>
<h1>{config.site_name || 'COCO&Bridge'}</h1>
<p className="hero-desc">{config.sub_copy}</p>
<div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
<a href={config.cta_url || '/contact'} className="btn-primary">{config.cta_text || '無料相談はこちら'}</a>
<a href="/services" className="btn-outline">サービスを見る</a>
</div>
</section>
)}

{sections.concept !== false && (
<section className="section">
<FadeIn><p className="section-subtitle">CONCEPT</p></FadeIn>
<FadeIn delay={1}><h2 className="section-title">{config.concept_title || 'COCO&Bridgeについて'}</h2></FadeIn>
<FadeIn delay={2}>
<p style={{ fontSize: '16px', lineHeight: '2', color: 'var(--gray-600)', maxWidth: '760px', margin: '32px auto 0', whiteSpace: 'pre-line' }}>
{config.concept_body}
</p>
</FadeIn>
</section>
)}

{sections.services !== false && (
<section style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
<p className="section-subtitle">SERVICES</p>
<h2 className="section-title">サービス一覧</h2>
<FadeIn>
<div className="services-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '40px' }}>
{services.map((service, i) => (
<div key={i} className="service-card-hover" style={{ background: 'white', borderRadius: '12px', padding: '36px 28px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,39,68,0.06)' }}>
<div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #1a2744, #b8954a)' }} />
<p style={{ display: 'inline-block', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.12em', background: 'rgba(184,149,74,0.08)', padding: '4px 10px', borderRadius: '20px', marginBottom: '16px' }}>
{service['カテゴリ']}
</p>
<h3 style={{ fontSize: '19px', fontWeight: '700', color: 'var(--navy)', marginBottom: '12px', lineHeight: '1.4' }}>
{service['サービス名']}
</h3>
<p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.9' }}>
{service['キャッチコピー']}
</p>
{service['月額料金'] && (
<div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--gray-200)', fontSize: '13px', color: 'var(--gray-600)' }}>
月額 <strong style={{ fontSize: '22px', color: 'var(--navy)', fontWeight: '700' }}>¥{Number(service['月額料金']).toLocaleString()}</strong> 〜
</div>
)}
</div>
))}
</div>
</FadeIn>
<div style={{ textAlign: 'center', marginTop: '40px' }}>
<a href="/services" className="btn-primary">サービス詳細を見る</a>
</div>
</div>
</section>
)}

{sections.profile !== false && (
<section className="section">
<p className="section-subtitle">PROFILE</p>
<h2 className="section-title">代表プロフィール</h2>
<FadeIn>
<div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginTop: '48px', flexWrap: 'wrap' }}>
<img
src={config.profile_image}
alt={config.profile_name}
style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }}
/>
<div style={{ flex: 1, minWidth: '240px' }}>
<h3 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '12px' }}>{config.profile_name}</h3>
<p style={{ fontSize: '15px', lineHeight: '1.9', color: 'var(--gray-600)' }}>{config.profile_short}</p>
<a href="/about" style={{ display: 'inline-block', marginTop: '16px', fontSize: '14px', color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>
プロフィール詳細 →
</a>
</div>
</div>
</FadeIn>
</section>
)}

{sections.staff !== false && staff.length > 0 && (
<section style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
<div style={{ maxWidth: '960px', margin: '0 auto' }}>
<p className="section-subtitle">STAFF</p>
<h2 className="section-title">スタッフ紹介</h2>
<FadeIn>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px', marginTop: '40px' }}>
{staff.map((member, i) => (
<div key={i} style={{ background: 'white', borderRadius: '14px', padding: '28px 24px', boxShadow: '0 2px 12px rgba(26,39,68,0.06)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
<div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #1a2744, #b8954a)' }} />
{member['画像URL'] ? (
<img src={member['画像URL']} alt={member['名前']} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '12px' }} />
) : (
<div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a2744, #b8954a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '26px', color: 'white', fontWeight: '700' }}>
{member['名前']?.charAt(0)}
</div>
)}
<p style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '4px' }}>{member['役職']}</p>
<h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--navy)', marginBottom: '10px' }}>{member['名前']}</h3>
<p style={{ fontSize: '13px', color: 'var(--gray-600)', lineHeight: '1.8', textAlign: 'left' }}>{member['自己紹介']}</p>
</div>
))}
</div>
</FadeIn>
<div style={{ textAlign: 'center', marginTop: '32px' }}>
<a href="/staff" style={{ fontSize: '14px', color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>
スタッフ一覧を見る →
</a>
</div>
</div>
</section>
)}

{sections.news !== false && news.length > 0 && (
<section className="section" style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
<p className="section-subtitle">NEWS</p>
<h2 className="section-title">お知らせ</h2>
<ul style={{ listStyle: 'none', padding: 0, maxWidth: '760px', margin: '32px auto 0' }}>
{news.map((item, i) => (
<li key={i} style={{ display: 'flex', gap: '24px', padding: '20px 0', borderBottom: '1px solid var(--gray-200)', alignItems: 'baseline' }}>
<time style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{item['日付']}</time>
<span style={{ fontSize: '15px', color: 'var(--navy)' }}>{item['タイトル']}</span>
</li>
))}
</ul>
<div style={{ textAlign: 'center', marginTop: '32px' }}>
<a href="/blog" style={{ fontSize: '14px', color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>
お知らせ一覧を見る →
</a>
</div>
</section>
)}

{sections.access !== false && (
<section className="section">
<div style={{ maxWidth: '760px', margin: '0 auto' }}>
<p className="section-subtitle">ACCESS</p>
<h2 className="section-title">アクセス</h2>
<FadeIn>
<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px', marginTop: '40px' }}>
<tbody>
{Object.entries(ACCESS_LABELS)
.filter(([key]) => access[key])
.map(([key, label], i) => (
<tr key={i} style={{ borderBottom: '1px solid var(--gray-200)' }}>
<th style={{ width: '140px', padding: '16px 16px 16px 0', fontWeight: '700', color: 'var(--navy)', verticalAlign: 'top', textAlign: 'left', whiteSpace: 'nowrap' }}>
{label}
</th>
<td style={{ padding: '16px 0', color: 'var(--gray-600)', lineHeight: '1.8' }}>
{access[key]}
</td>
</tr>
))}
</tbody>
</table>
</FadeIn>
<FadeIn delay={1}>
<div style={{ textAlign: 'center', marginTop: '32px' }}>
<a href="/access" style={{ fontSize: '14px', color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>
アクセス詳細を見る →
</a>
</div>
</FadeIn>
</div>
</section>
)}

{sections.recruit !== false && (
<section style={{ background: 'var(--gray-100)', padding: '80px 40px' }}>
<div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
<p className="section-subtitle">RECRUIT</p>
<h2 className="section-title">採用情報</h2>
<FadeIn>
<p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.9', marginTop: '24px', marginBottom: '32px' }}>
COCO&Bridgeでは、中小企業のDX推進を共に担うメンバーを募集しています。
</p>
<a href="/recruit" className="btn-primary">採用情報を見る</a>
</FadeIn>
</div>
</section>
)}

{sections.cta !== false && (
<section className="section" style={{ background: 'var(--navy)', color: 'white', textAlign: 'center' }}>
<p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>CONTACT</p>
<h2 className="section-title" style={{ color: 'white' }}>お問い合わせ</h2>
<p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>{config.cta_text || 'まずはお気軽にご相談ください。'}</p>
<a href={config.cta_url || '/contact'} className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>
お問い合わせはこちら
</a>
</section>
)}

<footer className="footer">
<div className="footer-logo">COCO<span>&</span>Bridge</div>
<p>© {new Date().getFullYear()} {config.footer_text || 'COCO&Bridge株式会社'}</p>
</footer>
</>
)
  }
