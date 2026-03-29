import type { Block } from 'notion-types'
import { NotionText } from '../NotionText'
import { getBlockTitle } from '../block-helpers'

interface Props {
  block: Block
  children?: React.ReactNode
}

export function TodoBlock({ block, children }: Props) {
  const title = getBlockTitle(block)
  const checked = (block.properties as any)?.checked?.[0]?.[0] === 'Yes'

  return (
    <div className={`notion-to-do ${checked ? 'notion-to-do-checked' : ''}`}>
      <div className="notion-to-do-item">
        <div className="notion-to-do-checkbox">
          <input type="checkbox" checked={checked} readOnly />
        </div>
        <div className="notion-to-do-body">
          <NotionText value={title} />
        </div>
      </div>
      {children && <div className="notion-to-do-children">{children}</div>}
    </div>
  )
}
