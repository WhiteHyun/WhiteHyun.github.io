import type { NextApiRequest, NextApiResponse } from 'next'

const NOTION_API = 'https://www.notion.so/api/v3'
const NOTION_SITE = 'https://whitehyun.notion.site'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query
  const apiPath = Array.isArray(path) ? path.join('/') : path || ''
  const notionUrl = `${NOTION_API}/${apiPath}`

  try {
    let body = req.body

    // Force requestedOnPublicDomain so Notion doesn't show interstitial
    if (apiPath === 'getPublicPageData' && body) {
      body = { ...body, requestedOnPublicDomain: true }
    }

    const response = await fetch(notionUrl, {
      method: req.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Origin': NOTION_SITE,
        'Referer': NOTION_SITE + '/',
        'notion-client-version': '23.13.20260322.0347',
      },
      body: req.method !== 'GET' ? JSON.stringify(body) : undefined,
    })

    let data = await response.text()

    // Rewrite notion.site URLs in API responses
    const host = req.headers.host || 'localhost:3000'
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const myOrigin = `${protocol}://${host}`
    data = data.replaceAll('https://whitehyun.notion.site', myOrigin)

    // Remove requireInterstitial to prevent redirect/not-found
    if (apiPath === 'getPublicPageData') {
      try {
        const json = JSON.parse(data)
        delete json.requireInterstitial
        data = JSON.stringify(json)
      } catch {}
    }

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(response.status).send(data)
  } catch (err: any) {
    console.error('API proxy error:', err.message)
    res.status(500).json({ error: 'Proxy error' })
  }
}
