import './globals.css'

export const metadata = {
  title: 'COCO&Bridge | 中小企業のデジタル伴走パートナー',
  description: 'ウェブ制作・SNS運用・DX支援を通じて、中小企業のデジタル化を一緒に進めます。',
}

async function getSiteConfig() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_GAS_API}?sheet=サイト全体設定`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    const config = {}
    data.forEach(row => { config[row['項目キー']] = row['値'] })
    return config
  } catch (e) {
    return {}
  }
}

export default async function RootLayout({ children }) {
  const config = await getSiteConfig()
  const colorMain = config.color_main || '#1a2744'
  const colorAccent = config.color_accent || '#b8954a'
  const dynamicCSS = `
    :root {
      --navy: ${colorMain};
      --gold: ${colorAccent};
      --gold-light: ${colorAccent}dd;
    }
  `
  return (
    <html lang="ja">
      <head>
        <style dangerouslySetInnerHTML={{ __html: dynamicCSS }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
