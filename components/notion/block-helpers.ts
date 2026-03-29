import type { Block, Decoration } from 'notion-types'

/** Notion 호스트 URL */
export const NOTION_HOST = 'https://www.notion.so'

/** Notion 내부 경로(/icons/ 등)를 완전한 URL로 변환 */
export function resolveNotionIconUrl(icon: string): string {
  if (icon.startsWith('/')) {
    return `${NOTION_HOST}${icon}`
  }
  return icon
}

/** Notion S3 이미지를 프록시 URL로 변환 */
export function resolveNotionImageUrl(url: string, blockId: string): string {
  if (!url) return url
  if (url.includes('secure.notion-static.com') || url.includes('prod-files-secure.s3')) {
    return `${NOTION_HOST}/image/${encodeURIComponent(url)}?table=block&id=${blockId}&cache=v2`
  }
  return url
}

// --- Block 속성 접근 헬퍼 (notion-types의 Block 타입에 누락된 속성들) ---

export function getBlockTitle(block: Block): Decoration[] | undefined {
  return (block.properties as any)?.title
}

export function getBlockCaption(block: Block): Decoration[] | undefined {
  return (block.properties as any)?.caption
}

export function getBlockIcon(block: Block): string | undefined {
  return (block.format as any)?.page_icon
}

export function getBlockColor(block: Block): string | undefined {
  return (block.format as any)?.block_color
}

export function getBlockAlignment(block: Block): 'left' | 'center' | 'right' | undefined {
  return (block.format as any)?.block_alignment
}
