export const metadata = {
  title: 'プライバシーポリシー｜COCO&Bridge',
}

export default function PrivacyPage() {
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

      <section style={{ padding: '80px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a2744', marginBottom: '8px' }}>
          プライバシーポリシー
        </h1>
        <p style={{ color: '#999', fontSize: '13px', marginBottom: '48px' }}>最終更新日：2026年6月27日</p>

        {[
          {
            title: '1. 事業者情報',
            content: 'COCO&Bridge株式会社（以下「当社」）は、お客様の個人情報の保護を重要な責務と考え、以下のプライバシーポリシーに従って個人情報を取り扱います。',
          },
          {
            title: '2. 収集する個人情報',
            content: '当社は、お問い合わせフォームを通じて、お名前、会社名、メールアドレス、電話番号、お問い合わせ内容を収集します。',
          },
          {
            title: '3. 個人情報の利用目的',
            content: '収集した個人情報は、お問い合わせへの回答・連絡、サービスのご案内、および法令に基づく対応のみに使用します。',
          },
          {
            title: '4. 個人情報の第三者提供',
            content: '当社は、法令に基づく場合り除き、お客様の事前の同意なく個人情報を第三者に提供しません。',
          },
          {
            title: '5. 個人情報の管理',
            content: '当社は、個人情報への不正アクセス・紛失・破損・改しん・漏洩を防ぐため、適切な安全管理措置を講じます。',
          },
          {
            title: '6. reCAPTCHAの利用',
            content: '当社のお問い合わせフォームにはGoogle reCAPTCHA v3を使用しています。reCAPTCHAはGoogleのプライバシーポリシーおよび利用規約に従って動作します。',
          },
          {
            title: '7. 開示・訂正・削除',
            content: 'お喢様は、当社が保有するご自身の個人情報ついて、開示・訂正・削除を求める権利があります。ご要望はお問い合わせフォームよりご連絡ください。',
          },
          {
            title: '8. プライバシーポリシーの変更',
            content: '当社は、必要に応じて本ポリシーを変更することがあります。変更後はこのページに掲載します。',
          },
          {
            title: '9. お問い合わせ',
            content: '個人情報の取り扱いに関するお問い合わせは、お問い合わせフォームりりご連絡ください。',
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a2744', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0' }}>
              {section.title}
            </h2>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.9' }}>
              {section.content}
            </p>
          </div>
        ))}

        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <a href="/contact" className="btn-primary">お問い合わせに戻る</a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">COCO<span>&</span>Bridge</div>
        <p>© {new Date().getFullYear()} COCO&Bridge株式会社</p>
      </footer>
    </>
  )
}
