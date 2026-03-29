import type { Block } from 'notion-types'
import { uuidToId } from 'notion-utils'
import { NotionText } from '../NotionText'
import { getBlockTitle } from '../block-helpers'

interface Props {
  block: Block
  tag: 'h2' | 'h3' | 'h4'
  children?: React.ReactNode
}

export function HeadingBlock({ block, tag: Tag, children }: Props) {
  const title = getBlockTitle(block)
  const id = uuidToId(block.id)
  const isToggleable = (block.format as any)?.toggleable

  const classMap = { h2: 'notion-h2', h3: 'notion-h3', h4: 'notion-h4' }
  const className = `notion-h ${classMap[Tag]}`

  const content = <NotionText value={title} />

  if (isToggleable) {
    return (
      <details className="notion-toggle">
        <summary>
          <Tag id={id} className={className}>{content}</Tag>
        </summary>
        <div>{children}</div>
      </details>
    )
  }

  return (
    <>
      <Tag id={id} className={className}>{content}</Tag>
      {children}
    </>
  )
}
