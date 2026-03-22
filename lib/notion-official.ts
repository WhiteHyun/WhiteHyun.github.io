// Uses the official Notion API to fetch database entries for the home page
// This works reliably unlike the unofficial queryCollection endpoint

interface NotionPage {
  id: string
  title: string
  slug: string
  date: string
  tags: string[]
  category: string
  icon?: string
}

const DATABASE_ID = '0d637334ef66431eb8fb0ccd5e756583'
const NOTION_API_SECRET = process.env.NOTION_API_SECRET

export async function getPublishedPosts(): Promise<NotionPage[]> {
  if (!NOTION_API_SECRET) {
    console.warn('NOTION_API_SECRET not set, skipping official API fetch')
    return []
  }

  const pages: NotionPage[] = []
  let hasMore = true
  let startCursor: string | undefined

  while (hasMore) {
    const body: any = {
      filter: {
        property: 'Publish Status',
        status: { equals: 'Published' }
      },
      sorts: [
        { property: 'Post Date', direction: 'descending' }
      ],
      page_size: 100
    }
    if (startCursor) {
      body.start_cursor = startCursor
    }

    const res = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_SECRET}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )

    if (!res.ok) {
      console.error('Notion API error:', res.status, await res.text())
      break
    }

    const data = await res.json()

    for (const page of data.results) {
      const props = page.properties
      const title = props.Name?.title?.[0]?.plain_text || 'Untitled'
      const date = props['Post Date']?.date?.start || ''
      const tags = (props.Hashtag?.multi_select || []).map((t: any) => t.name)
      const category = props.Category?.select?.name || ''
      const icon = page.icon?.emoji || page.icon?.external?.url || ''

      // Generate slug from page URL (same as previous astro-notion-blog approach)
      const pageUrl = page.url || ''
      const slug = extractSlugFromUrl(pageUrl, page.id)

      pages.push({ id: page.id, title, slug, date, tags, category, icon })
    }

    hasMore = data.has_more
    startCursor = data.next_cursor
  }

  return pages
}

function extractSlugFromUrl(url: string, pageId: string): string {
  // Notion URL format: https://www.notion.so/Title-Words-Here-<pageId>
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const lastPart = pathParts[pathParts.length - 1] || ''
    // Remove the page ID suffix (32 hex chars at the end)
    const cleanId = pageId.replace(/-/g, '')
    if (lastPart.endsWith(cleanId)) {
      const slug = lastPart.slice(0, -(cleanId.length)).replace(/-$/, '')
      return slug || cleanId
    }
    return lastPart || cleanId
  } catch {
    return pageId.replace(/-/g, '')
  }
}
