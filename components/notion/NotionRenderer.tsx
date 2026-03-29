import type { ExtendedRecordMap } from 'notion-types'
import { NotionProvider } from './NotionContext'
import { BlockChildren } from './NotionBlock'
import { NotionText } from './NotionText'
import { NotionIcon } from './NotionIcon'
import { resolveNotionIconUrl } from './block-helpers'

interface NotionRendererProps {
  recordMap: ExtendedRecordMap
  fullPage?: boolean
  mapPageUrl?: (pageId: string) => string
  className?: string
}

function defaultMapPageUrl(pageId: string): string {
  return `/${pageId}`
}

export function NotionRenderer({
  recordMap,
  fullPage = false,
  mapPageUrl = defaultMapPageUrl,
  className,
}: NotionRendererProps) {
  const rootBlock = (Object.values(recordMap.block)[0] as any)?.value
  if (!rootBlock) return null

  return (
    <NotionProvider recordMap={recordMap} mapPageUrl={mapPageUrl}>
      {fullPage ? (
        <FullPage block={rootBlock} className={className} />
      ) : (
        <div className={`notion ${className || ''}`}>
          <BlockChildren block={rootBlock} />
        </div>
      )}
    </NotionProvider>
  )
}

function FullPage({ block, className }: { block: any; className?: string }) {
  const title = block.properties?.title
  const cover = block.format?.page_cover
  const icon = block.format?.page_icon
  const coverPosition = block.format?.page_cover_position ?? 0.5

  const hasCover = !!cover
  const hasIcon = !!icon

  const pageClasses = [
    'notion-page',
    'notion-full-page',
    hasCover ? 'notion-page-has-cover' : 'notion-page-no-cover',
    hasIcon ? 'notion-page-has-icon' : 'notion-page-no-icon',
  ].join(' ')

  return (
    <div className={`notion notion-app ${className || ''}`}>
      <div className="notion-frame">
        <div className="notion-page-scroller">
          {hasCover && (
            <div className="notion-page-cover-wrapper">
              <img
                className="notion-page-cover"
                src={resolveNotionIconUrl(cover)}
                alt=""
                style={{ objectPosition: `center ${(1 - coverPosition) * 100}%` }}
              />
            </div>
          )}

          <main className={pageClasses}>
            {hasIcon && (
              <div className="notion-page-icon-wrapper">
                <NotionIcon icon={icon} className="notion-page-icon" />
              </div>
            )}

            <h1 className="notion-title">
              <NotionText value={title} />
            </h1>

            <div className="notion-page-content">
              <article className="notion-page-content-inner">
                <BlockChildren block={block} />
              </article>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
