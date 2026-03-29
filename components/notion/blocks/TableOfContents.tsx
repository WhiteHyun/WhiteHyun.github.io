import { getPageTableOfContents } from 'notion-utils'
import type { Block } from 'notion-types'
import { useNotion } from '../NotionContext'

export function TableOfContentsBlock() {
  const { recordMap } = useNotion()

  // Find the root page block
  const pageBlock = Object.values(recordMap.block).find(
    (b: any) => b.value?.type === 'page'
  ) as any
  if (!pageBlock?.value) return null

  const toc = getPageTableOfContents(pageBlock.value, recordMap)
  if (!toc.length) return null

  return (
    <div className="notion-table-of-contents">
      {toc.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="notion-table-of-contents-item"
          style={{ marginInlineStart: (item.indentLevel || 0) * 24 }}
        >
          <span className="notion-table-of-contents-item-text">{item.text}</span>
        </a>
      ))}
    </div>
  )
}
