import './globals.css'

export const metadata = {
  title: 'COCO&Bridge | ä¸­å°ä¼æ¥­ã®ãã¸ã¿ã«ä¼´èµ°ãã¼ããã¼',
  description: 'ã¦ã§ãå¶ä½ã»SNSéç¨ã»DXæ¯æ´ãéãã¦ãä¸­å°ä¼æ¥­ã®ãã¸ã¿ã«åãä¸ç·ã«é²ãã¾ãã',
}

async function getSiteConfig() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_GAS_API}?sheet=ãµã¤ãå¨ä½è¨­å®`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    const config = {}
    data.forEach(row => { config[row['é ç®ã­ã¼']] = row['å¤'] })
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: dynamicCSS }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
