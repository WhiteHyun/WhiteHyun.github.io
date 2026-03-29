import type { Block } from 'notion-types'
import { NotionText } from '../NotionText'
import { getBlockTitle, getBlockColor } from '../block-helpers'

interface Props {
  block: Block
  children?: React.ReactNode
}

export function QuoteBlock({ block, children }: Props) {
  const title = getBlockTitle(block)
  const color = getBlockColor(block)

  return (
    <blockquote className={`notion-quote ${color ? `notion-${color}` : ''}`}>
      <div>
        <NotionText value={title} />
      </div>
      {children}
    </blockquote>
  )
}
