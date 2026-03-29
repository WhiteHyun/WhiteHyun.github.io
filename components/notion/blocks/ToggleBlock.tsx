import type { Block } from 'notion-types'
import { NotionText } from '../NotionText'
import { getBlockTitle } from '../block-helpers'

interface Props {
  block: Block
  children?: React.ReactNode
}

export function ToggleBlock({ block, children }: Props) {
  const title = getBlockTitle(block)

  return (
    <details className="notion-toggle">
      <summary>
        <div className="notion-toggle-icon">
          <svg
            viewBox="0 0 16 16"
            className="notion-toggle-arrow"
            aria-hidden="true"
          >
            <path d="M2.835 3.25a.8.8 0 0 0-.69 1.203l5.164 8.854a.8.8 0 0 0 1.382 0l5.165-8.854a.8.8 0 0 0-.691-1.203z" />
          </svg>
        </div>
        <div className="notion-toggle-title">
          <NotionText value={title} />
        </div>
      </summary>
      <div className="notion-toggle-content">{children}</div>
    </details>
  )
}
