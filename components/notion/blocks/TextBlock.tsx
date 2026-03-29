import type { Block } from 'notion-types'
import { NotionText } from '../NotionText'
import { getBlockTitle } from '../block-helpers'

interface Props {
  block: Block
  children?: React.ReactNode
}

export function TextBlock({ block, children }: Props) {
  const title = getBlockTitle(block)

  if (!title || title.length === 0 || (title.length === 1 && !title[0][0])) {
    return <div className="notion-blank">&nbsp;</div>
  }

  return (
    <div className="notion-text">
      <NotionText value={title} />
      {children}
    </div>
  )
}
