import './globals.css'

export const metadata = {
  title: 'COCO&Bridge | 中小企業のデジタル伴走パートナー',
  description: 'ウェブ制作・SNS運用・DX支援を通じて、中小企業のデジタル化を一緒に進めます。',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
