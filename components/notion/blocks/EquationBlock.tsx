import type { Block } from 'notion-types'
import { getBlockTitle } from '../block-helpers'

interface Props {
  block: Block
}

export function EquationBlock({ block }: Props) {
  const latex = getBlockTitle(block)?.[0]?.[0] || ''

  try {
    const katex = require('katex')
    const html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
    })
    return (
      <div
        className="notion-equation notion-equation-block"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  } catch {
    return <div className="notion-equation"><code>{latex}</code></div>
  }
}
