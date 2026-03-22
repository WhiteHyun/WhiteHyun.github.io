import type { NextApiRequest, NextApiResponse } from 'next'

const NOTION_API = 'https://www.notion.so/api/v3'
const NOTION_SITE = 'https://whitehyun.notion.site'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query
  const apiPath = Array.isArray(path) ? path.join('/') : path || ''
  const notionUrl = `${NOTION_API}/${apiPath}`

  try {
    const response = await fetch(notionUrl, {
      method: req.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Origin': NOTION_SITE,
        'Referer': NOTION_SITE + '/',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    })

    let data = await response.text()

    // Rewrite ALL Notion domain references in API responses
    const host = req.headers.host || 'localhost:3000'
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const myOrigin = `${protocol}://${host}`
    data = data.replaceAll('https://whitehyun.notion.site', myOrigin)
    data = data.replaceAll('https://www.notion.so', myOrigin)
    data = data.replaceAll('https://notion.so', myOrigin)

    // Remove requireInterstitial to prevent redirect/not-found
    if (apiPath === 'getPublicPageData') {
      try {
        const json = JSON.parse(data)
        delete json.requireInterstitial
        data = JSON.stringify(json)
      } catch {}
    }

    // Remove CSP headers
    res.removeHeader('Content-Security-Policy')
    res.removeHeader('X-Content-Security-Policy')
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(response.status).send(data)
  } catch (err: any) {
    console.error('API proxy error:', err.message)
    res.status(500).json({ error: 'Proxy error' })
  }
}
