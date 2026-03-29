import type { Block } from 'notion-types'
import { NotionText } from '../NotionText'
import { NotionIcon } from '../NotionIcon'
import { getBlockTitle, getBlockIcon, getBlockColor } from '../block-helpers'

interface Props {
  block: Block
  children?: React.ReactNode
}

export function CalloutBlock({ block, children }: Props) {
  const title = getBlockTitle(block)
  const icon = getBlockIcon(block)
  const color = getBlockColor(block)

  return (
    <div className={`notion-callout ${color ? `notion-${color}` : ''}`}>
      {icon && (
        <div className="notion-callout-icon">
          <NotionIcon icon={icon} />
        </div>
      )}
      <div className="notion-callout-text">
        <NotionText value={title} />
        {children}
      </div>
    </div>
  )
}
