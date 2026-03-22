import { GetServerSideProps } from 'next'

const NOTION_SITE = 'https://whitehyun.notion.site'
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

export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl }) => {
  try {
    // Map root to the database page
    const notionPath = resolvedUrl === '/' ? `/${ROOT_PAGE_ID}` : resolvedUrl
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

    // Rewrite Notion site URLs to our domain
    const host = req.headers.host || 'localhost:3000'
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const myDomain = `${protocol}://${host}`

    html = html.replaceAll('https://whitehyun.notion.site', myDomain)
    html = html.replaceAll('whitehyun.notion.site', host)

    // Inject custom CSS before </head>
    html = html.replace(
      '</head>',
      `<style>${CUSTOM_CSS}</style></head>`
    )

    // Set response headers
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
