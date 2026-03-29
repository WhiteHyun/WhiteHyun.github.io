import type { Block } from 'notion-types'
import { useNotion } from '../NotionContext'
import { NotionText } from '../NotionText'
import { getBlockCaption, getBlockAlignment, resolveNotionImageUrl } from '../block-helpers'

interface Props {
  block: Block
}

export function ImageBlock({ block }: Props) {
  const { recordMap } = useNotion()
  const format = block.format as any
  const caption = getBlockCaption(block)
  const propertySource = (block.properties as any)?.source?.[0]?.[0]
  const signedUrl = (recordMap as any).signed_urls?.[block.id]

  // attachment: URLs are internal — use signed URL instead
  const rawSource = (propertySource?.startsWith('attachment:') ? signedUrl : propertySource)
    || signedUrl
    || format?.display_source

  if (!rawSource) return null

  const source = resolveNotionImageUrl(rawSource, block.id)

  const width = format?.block_width
  const height = format?.block_height
  const aspectRatio = format?.block_aspect_ratio
  const blockFullWidth = format?.block_full_width
  const blockPageWidth = format?.block_page_width
  const alignment = getBlockAlignment(block)

  // figure에 width+padding을 함께 적용 (box-sizing: border-box)
  const figureStyle: React.CSSProperties = {}
  if (blockFullWidth) {
    // 뷰포트 전체 너비 (컨테이너 돌파)
  } else if (width) {
    figureStyle.width = width
    figureStyle.maxWidth = '100%'
  }

  const isFullWidth = !!blockFullWidth
  const align = alignment || 'left'
  const alignClass = isFullWidth
    ? 'notion-asset-full-width'
    : align !== 'left' ? `notion-asset-align-${align}` : ''

  // 내부 컨테이너: aspect-ratio (full-width는 고정 높이이므로 불필요)
  const contentStyle: React.CSSProperties = { width: '100%' }
  if (!isFullWidth && aspectRatio) {
    contentStyle.aspectRatio = `auto ${width || 'auto'} / ${Math.round((width || 100) * aspectRatio)}`
  }

  // 이미지 스타일: full-width는 고정 높이 + object-fit: cover
  const imgStyle: React.CSSProperties = {
    width: '100%',
    display: 'block',
  }
  if (isFullWidth && height) {
    imgStyle.height = height
    imgStyle.objectFit = 'cover'
  } else {
    imgStyle.height = 'auto'
  }

  return (
    <figure
      className={`notion-asset-wrapper notion-asset-wrapper-image ${alignClass}`}
      style={figureStyle}
    >
      <div style={contentStyle}>
        <img
          src={source}
          alt={caption ? caption.map((seg: any) => seg[0]).join('') : ''}
          loading="lazy"
          style={imgStyle}
        />
        {caption && (
          <figcaption className="notion-asset-caption">
            <NotionText value={caption} />
          </figcaption>
        )}
      </div>
    </figure>
  )
}
