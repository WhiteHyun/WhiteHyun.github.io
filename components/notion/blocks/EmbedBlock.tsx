import type { Block } from 'notion-types'
import { useNotion } from '../NotionContext'
import { NotionText } from '../NotionText'
import { getBlockCaption } from '../block-helpers'

interface Props {
  block: Block
}

export function EmbedBlock({ block }: Props) {
  const { recordMap } = useNotion()
  const format = block.format as any
  const caption = getBlockCaption(block)
  const source = (block.properties as any)?.source?.[0]?.[0]
    || (recordMap as any).signed_urls?.[block.id]
    || format?.display_source

  if (!source) return null

  const width = format?.block_width
  const height = format?.block_height
  const aspectRatio = format?.block_aspect_ratio

  const style: React.CSSProperties = {}
  if (width) style.width = width
  if (height) style.height = height
  if (aspectRatio && !height) {
    style.paddingBottom = `${aspectRatio * 100}%`
    style.position = 'relative'
  }

  const isVideo = block.type === 'video'
  const isAudio = block.type === 'audio'
  const isPdf = block.type === 'pdf'

  let content: React.ReactNode
  if (isVideo) {
    if (source.includes('youtube') || source.includes('youtu.be') || source.includes('vimeo')) {
      content = (
        <iframe
          src={source}
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      )
    } else {
      content = <video src={source} controls style={{ width: '100%' }} />
    }
  } else if (isAudio) {
    content = <audio src={source} controls style={{ width: '100%' }} />
  } else if (isPdf) {
    content = (
      <iframe
        src={source}
        style={{ width: '100%', height: height || 600, border: 'none' }}
      />
    )
  } else {
    content = (
      <iframe
        src={source}
        frameBorder="0"
        loading="lazy"
        style={aspectRatio
          ? { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }
          : { width: width || '100%', height: height || 400, border: 'none' }
        }
      />
    )
  }

  return (
    <figure className={`notion-asset-wrapper notion-asset-wrapper-${block.type}`}>
      <div style={style}>{content}</div>
      {caption && (
        <figcaption className="notion-asset-caption">
          <NotionText value={caption} />
        </figcaption>
      )}
    </figure>
  )
}
