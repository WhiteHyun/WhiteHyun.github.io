import { Fragment } from 'react'
import type { Decoration, SubDecoration } from 'notion-types'
import { useNotion } from './NotionContext'

interface NotionTextProps {
  value?: Decoration[]
}

export function NotionText({ value }: NotionTextProps) {
  if (!value) return null

  return (
    <>
      {value.map(([text, decorations], i) => {
        const rendered = renderTextWithBreaks(text)

        if (!decorations || decorations.length === 0) {
          return <Fragment key={i}>{rendered}</Fragment>
        }

        const element = decorations.reduce<React.ReactNode>(
          (el, decoration) => applyDecoration(el, decoration),
          <>{rendered}</>
        )

        return <Fragment key={i}>{element}</Fragment>
      })}
    </>
  )
}

function renderTextWithBreaks(text: string): React.ReactNode {
  if (!text.includes('\n')) return text
  return text.split('\n').map((line, i, arr) => (
    <Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ))
}

function applyDecoration(
  element: React.ReactNode,
  decoration: SubDecoration
): React.ReactNode {
  const type = decoration[0]

  switch (type) {
    case 'b':
      return <b>{element}</b>
    case 'i':
      return <em>{element}</em>
    case 's':
      return <s>{element}</s>
    case 'c':
      return <code className="notion-inline-code">{element}</code>
    case '_':
      return <span className="notion-inline-underscore">{element}</span>
    case 'h': {
      const color = decoration[1] as string
      return <span className={`notion-${color}`}>{element}</span>
    }
    case 'a': {
      const url = decoration[1] as string
      return (
        <a className="notion-link" href={url} target="_blank" rel="noopener noreferrer">
          <span>{element}</span>
        </a>
      )
    }
    case 'p': {
      const pageId = decoration[1] as string
      return <PageLink pageId={pageId}>{element}</PageLink>
    }
    case 'lm': {
      const meta = decoration[1] as any
      if (!meta || typeof meta !== 'object') return element
      return <LinkMention meta={meta} />
    }
    case '‣': {
      // Inline page/database mention
      const data = decoration[1] as any
      if (Array.isArray(data)) {
        const [, linkId] = data
        if (linkId) return <PageLink pageId={linkId}>{element}</PageLink>
      }
      return element
    }
    case 'e': {
      const latex = decoration[1] as string
      return <InlineEquation latex={latex} />
    }
    case 'd': {
      const date = decoration[1] as any
      return <>{formatNotionDate(date)}</>
    }
    default:
      return element
  }
}

function PageLink({ pageId, children }: { pageId: string; children: React.ReactNode }) {
  const { mapPageUrl, recordMap } = useNotion()

  // Try to get page title from recordMap
  const block = (recordMap.block[pageId] as any)?.value
  const title = block?.properties?.title?.flat()?.join('') || children

  return <a className="notion-link" href={mapPageUrl(pageId)}>{title}</a>
}

function LinkMention({ meta }: { meta: any }) {
  const { href, title, icon_url, link_provider } = meta

  return (
    <span className="notion-link-mention">
      <a
        className="notion-link-mention-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {icon_url && (
          <img className="notion-link-mention-icon" src={icon_url} alt="" />
        )}
        {link_provider && (
          <span className="notion-link-mention-provider">{link_provider}</span>
        )}
        <span className="notion-link-mention-title">{title || href}</span>
      </a>
    </span>
  )
}

function InlineEquation({ latex }: { latex: string }) {
  try {
    const katex = require('katex')
    const html = katex.renderToString(latex, { throwOnError: false })
    return <span className="notion-inline-equation" dangerouslySetInnerHTML={{ __html: html }} />
  } catch {
    return <code>{latex}</code>
  }
}

function formatNotionDate(date: any): string {
  if (!date) return ''
  const { start_date, end_date, start_time, end_time } = date
  let result = start_date || ''
  if (start_time) result += ` ${start_time}`
  if (end_date) {
    result += ` → ${end_date}`
    if (end_time) result += ` ${end_time}`
  }
  return result
}
