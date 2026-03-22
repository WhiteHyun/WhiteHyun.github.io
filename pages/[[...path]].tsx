import { GetServerSideProps } from 'next'

const NOTION_SITE = 'https://whitehyun.notion.site'
const NOTION_SO = 'https://www.notion.so'
const ROOT_PAGE_ID = '0d637334ef66431eb8fb0ccd5e756583'

// Custom CSS to inject - hides Notion UI chrome
const CUSTOM_CSS = `
  /* Hide Notion top bar */
  .notion-topbar,
  .notion-presence-container { display: none !important; }

  /* Hide "Try Notion" / "Get Notion free" button */
  .notion-topbar-action-buttons,
  .notion-peek-renderer-action-bar { display: none !important; }

  /* Hide comments */
  .notion-page-view-discussion { display: none !important; }

  /* Hide "Made with Notion" / overlay */
  .notion-overlay-container,
  .notion-snack-bar-container { display: none !important; }

  /* Remove extra top padding from hidden topbar */
  .notion-page-content,
  .notion-scroller { padding-top: 0 !important; }
`

function getMyOrigin(req: any) {
  const host = req.headers.host || 'localhost:3000'
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  return { host, origin: `${protocol}://${host}` }
}

function rewriteDomains(body: string, host: string, origin: string) {
  return body
    .replaceAll('https://whitehyun.notion.site', origin)
    .replaceAll('whitehyun.notion.site', host)
    .replaceAll('https://www.notion.so', origin)
    .replaceAll('www.notion.so', host)
    .replaceAll('https://notion.so', origin)
    .replaceAll('notion.so', host)
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl }) => {
  const { host, origin } = getMyOrigin(req)

  try {
    const pathname = resolvedUrl.split('?')[0]

    // --- JS bundle proxy: /_assets/*.js or /app/*.js ---
    if ((pathname.startsWith('/_assets') || pathname.startsWith('/app')) && pathname.endsWith('.js')) {
      const jsUrl = `${NOTION_SO}${pathname}`
      const response = await fetch(jsUrl)
      if (!response.ok) {
        res.statusCode = response.status
        res.end()
        return { props: {} }
      }
      let js = await response.text()
      // Key: rewrite domain references in JS bundles (like Fruition)
      js = rewriteDomains(js, host, origin)

      res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
      res.write(js)
      res.end()
      return { props: {} }
    }

    // --- CSS/other asset proxy from Notion ---
    if (pathname.startsWith('/_assets') || pathname.startsWith('/app') || pathname.endsWith('.css')) {
      const assetUrl = `${NOTION_SO}${pathname}`
      const response = await fetch(assetUrl)
      if (!response.ok) {
        res.statusCode = response.status
        res.end()
        return { props: {} }
      }
      const contentType = response.headers.get('content-type') || 'application/octet-stream'
      const buffer = Buffer.from(await response.arrayBuffer())

      res.setHeader('Content-Type', contentType)
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
      res.write(buffer)
      res.end()
      return { props: {} }
    }

    // --- HTML page proxy ---
    const notionPath = pathname === '/' ? `/${ROOT_PAGE_ID}` : pathname
    const notionUrl = `${NOTION_SITE}${notionPath}`

    const response = await fetch(notionUrl, {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': req.headers['accept-language'] || 'ko-KR,ko;q=0.9',
      },
      redirect: 'follow'
    })

    if (!response.ok) {
      res.statusCode = response.status
      res.end()
      return { props: {} }
    }

    let html = await response.text()

    // Rewrite all Notion domain references
    html = rewriteDomains(html, host, origin)

    // Inject custom CSS
    html = html.replace('</head>', `<style>${CUSTOM_CSS}</style></head>`)

    // Remove Content-Security-Policy that would block our modifications
    res.removeHeader('Content-Security-Policy')
    res.removeHeader('X-Content-Security-Policy')
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.write(html)
    res.end()
  } catch (err: any) {
    console.error('Proxy error:', err.message)
    res.statusCode = 500
    res.end('Internal Server Error')
  }

  return { props: {} }
}

export default function NotionProxy() {
  return null
}
