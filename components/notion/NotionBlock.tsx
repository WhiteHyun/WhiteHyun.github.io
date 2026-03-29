import type { Block, ExtendedRecordMap } from 'notion-types'
import { useNotion } from './NotionContext'
import { NotionIcon } from './NotionIcon'
import { getBlockTitle, getBlockIcon } from './block-helpers'
import { TextBlock } from './blocks/TextBlock'
import { HeadingBlock } from './blocks/HeadingBlock'
import { CodeBlock } from './blocks/CodeBlock'
import { ListBlock } from './blocks/ListBlock'
import { DividerBlock } from './blocks/DividerBlock'
import { ImageBlock } from './blocks/ImageBlock'
import { BookmarkBlock } from './blocks/BookmarkBlock'
import { CalloutBlock } from './blocks/CalloutBlock'
import { QuoteBlock } from './blocks/QuoteBlock'
import { ToggleBlock } from './blocks/ToggleBlock'
import { TodoBlock } from './blocks/TodoBlock'
import { TableBlock, TableRowBlock } from './blocks/TableBlock'
import { ColumnListBlock, ColumnBlock } from './blocks/ColumnBlock'
import { EquationBlock } from './blocks/EquationBlock'
import { EmbedBlock } from './blocks/EmbedBlock'
import { TableOfContentsBlock } from './blocks/TableOfContents'

interface NotionBlockProps {
  blockId: string
  level: number
  listNumber?: number
  listDepth?: number
}

export function NotionBlock({ blockId, level, listNumber, listDepth = 0 }: NotionBlockProps) {
  const { recordMap } = useNotion()
  const block = getBlock(recordMap, blockId)
  if (!block || !block.alive) return null

  const children = renderChildren(block, recordMap, level, listDepth)

  switch (block.type) {
    case 'text':
      return <TextBlock block={block}>{children}</TextBlock>

    case 'header':
      return <HeadingBlock block={block} tag="h2">{children}</HeadingBlock>
    case 'sub_header':
      return <HeadingBlock block={block} tag="h3">{children}</HeadingBlock>
    case 'sub_sub_header':
      return <HeadingBlock block={block} tag="h4">{children}</HeadingBlock>

    case 'code':
      return <CodeBlock block={block} />

    case 'bulleted_list':
      return <ListBlock block={block} type="disc" depth={listDepth}>{children}</ListBlock>
    case 'numbered_list':
      return <ListBlock block={block} type="numbered" listNumber={listNumber} depth={listDepth}>{children}</ListBlock>

    case 'divider':
      return <DividerBlock />

    case 'image':
      return <ImageBlock block={block} />

    case 'bookmark':
      return <BookmarkBlock block={block} />

    case 'callout':
      return <CalloutBlock block={block}>{children}</CalloutBlock>

    case 'quote':
      return <QuoteBlock block={block}>{children}</QuoteBlock>

    case 'toggle':
      return <ToggleBlock block={block}>{children}</ToggleBlock>

    case 'to_do':
      return <TodoBlock block={block}>{children}</TodoBlock>

    case 'table':
      return <TableBlock block={block}>{children}</TableBlock>
    case 'table_row':
      return <TableRowBlock block={block} />

    case 'column_list':
      return <ColumnListBlock>{children}</ColumnListBlock>
    case 'column':
      return <ColumnBlock block={block}>{children}</ColumnBlock>

    case 'equation':
      return <EquationBlock block={block} />

    case 'table_of_contents':
      return <TableOfContentsBlock />

    case 'embed':
    case 'video':
    case 'audio':
    case 'pdf':
    case 'figma':
    case 'gist':
    case 'tweet':
    case 'maps':
    case 'codepen':
    case 'replit':
    case 'typeform':
    case 'excalidraw':
      return <EmbedBlock block={block} />

    case 'transclusion_reference': {
      const refId = (block.format as any)?.transclusion_reference_pointer?.id
      const container = refId ? getBlock(recordMap, refId) : undefined
      if (container?.content) {
        return <>{renderChildren(container, recordMap, level)}</>
      }
      return null
    }

    case 'page':
      return level > 0 ? <PageLinkBlock block={block} /> : null

    default:
      return null
  }
}

/** 블록의 자식을 렌더링 (NotionRenderer에서도 사용) */
export function BlockChildren({ block, level = 0 }: { block: Block; level?: number }) {
  const { recordMap } = useNotion()
  return renderChildren(block, recordMap, level)
}

// --- Private ---

function getBlock(recordMap: ExtendedRecordMap, blockId: string): Block | undefined {
  return (recordMap.block[blockId] as any)?.value
}

function renderChildren(
  block: Block,
  recordMap: ExtendedRecordMap,
  level: number,
  listDepth: number = 0,
): React.ReactNode {
  if (!block.content?.length) return null

  const isList = block.type === 'bulleted_list' || block.type === 'numbered_list'
  const childListDepth = isList ? listDepth + 1 : 0

  // numbered_list 연속 순번 계산
  let numberedCount = 0
  const listNumbers = new Map<string, number>()
  for (const childId of block.content) {
    const child = getBlock(recordMap, childId)
    if (child?.type === 'numbered_list' && child.alive) {
      listNumbers.set(childId, ++numberedCount)
    } else {
      numberedCount = 0
    }
  }

  return (
    <>
      {block.content.map((childId) => (
        <NotionBlock
          key={childId}
          blockId={childId}
          level={level + 1}
          listNumber={listNumbers.get(childId)}
          listDepth={childListDepth}
        />
      ))}
    </>
  )
}

function PageLinkBlock({ block }: { block: Block }) {
  const { mapPageUrl } = useNotion()
  const icon = getBlockIcon(block)
  const title = getBlockTitle(block)?.flat()?.join('') || 'Untitled'

  return (
    <a className="notion-page-link" href={mapPageUrl(block.id)}>
      {icon && <NotionIcon icon={icon} className="notion-page-link-icon" />}
      <span className="notion-page-link-title">{title}</span>
    </a>
  )
}
