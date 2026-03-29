import type { Block } from 'notion-types'

interface Props {
  block: Block
}

export function BookmarkBlock({ block }: Props) {
  const link = (block.properties as any)?.link?.[0]?.[0]
  const title = (block.properties as any)?.title?.[0]?.[0]
  const description = (block.properties as any)?.description?.[0]?.[0]
  const format = block.format as any
  const icon = format?.bookmark_icon
  const cover = format?.bookmark_cover
  const caption = (block.properties as any)?.caption

  if (!link) return null

  return (
    <>
      <a
        className="notion-bookmark"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="notion-bookmark-content">
          {title && <div className="notion-bookmark-title">{title}</div>}
          {description && <div className="notion-bookmark-description">{description}</div>}
          <div className="notion-bookmark-link">
            {icon && <img className="notion-bookmark-link-icon" src={icon} alt="" />}
            <span className="notion-bookmark-link-text">{link}</span>
          </div>
        </div>
        {cover && (
          <div className="notion-bookmark-image">
            <img src={cover} alt="" loading="lazy" />
          </div>
        )}
      </a>
      {caption && (
        <figcaption className="notion-asset-caption">
          {caption.map((seg: any, i: number) => seg[0]).join('')}
        </figcaption>
      )}
    </>
  )
}
