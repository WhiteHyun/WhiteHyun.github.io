import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'

// 공식 Notion API 클라이언트 (DB 쿼리용)
const notion = new Client({ auth: process.env.NOTION_API_KEY })

// 비공식 Notion 클라이언트 (recordMap 조회)
const notionClient = new NotionAPI()

const DATABASE_ID = process.env.NOTION_DATABASE_ID!

export interface PostMeta {
  id: string
  title: string
  date: string
  slug: string
  description: string
  tags: string[]
}

function getPlainText(prop: any): string {
  if (!prop) return ''
  if (prop.title) return prop.title[0]?.plain_text || ''
  if (prop.rich_text) return prop.rich_text[0]?.plain_text || ''
  return ''
}

function mapPageToPostMeta(page: any): PostMeta {
  const props = page.properties
  return {
    id: page.id,
    title: getPlainText(props.Title) || getPlainText(props.Name) || 'Untitled',
    date: props.Date?.date?.start || page.created_time,
    slug: getPlainText(props.Slug) || page.id,
    description: getPlainText(props.Description) || '',
    tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
  }
}

export async function getDatabasePosts(): Promise<PostMeta[]> {
  try {
    const response = await (notion.databases as any).query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Status',
        status: { equals: 'Published' },
      },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    })

    return response.results.map(mapPageToPostMeta)
  } catch (error: any) {
    // Status 프로퍼티가 없을 경우 필터 없이 재시도
    if (error.code === 'validation_error' && error.message?.includes('Status')) {
      const fallback = await (notion.databases as any).query({
        database_id: DATABASE_ID,
        sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      })

      return fallback.results.map(mapPageToPostMeta)
    }
    throw error
  }
}

export async function getPage(pageId: string) {
  return notionClient.getPage(pageId)
}
