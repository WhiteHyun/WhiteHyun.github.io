import type { NextApiRequest, NextApiResponse } from 'next'

const NOTION_API = 'https://www.notion.so/api/v3'

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
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    })

    const data = await response.text()

    // Forward response headers
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(response.status).send(data)
  } catch (err: any) {
    console.error('API proxy error:', err.message)
    res.status(500).json({ error: 'Proxy error' })
  }
}
