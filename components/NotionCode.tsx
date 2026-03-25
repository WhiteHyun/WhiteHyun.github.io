import { useRef, useState, useCallback, useEffect } from 'react'
import { useNotionContext } from 'react-notion-x'
import { getBlockTitle } from 'notion-utils'
import copyToClipboard from 'clipboard-copy'

export function Code({
  block,
  defaultLanguage = 'typescript',
  className,
}: {
  block: any
  defaultLanguage?: string
  className?: string
}) {
  const [isCopied, setIsCopied] = useState(false)
  const copyTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const { recordMap } = useNotionContext()
  const content = getBlockTitle(block, recordMap)
  const caption = block.properties?.caption

  const onClickCopy = useCallback(() => {
    void copyToClipboard(content)
    setIsCopied(true)
    if (copyTimeout.current) clearTimeout(copyTimeout.current)
    copyTimeout.current = setTimeout(() => setIsCopied(false), 1200)
  }, [content])

  return (
    <>
      {/* Notion 동일 구조: div 기반, pre/code 사용하지 않음 */}
      <div
        className={`notion-code ${className || ''}`}
        tabIndex={0}
      >
        <div className="notion-code-copy">
          <div className="notion-code-copy-button" onClick={onClickCopy}>
            <svg fill="currentColor" viewBox="0 0 16 16" width="1em" version="1.1">
              <path fillRule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z" />
              <path fillRule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z" />
            </svg>
          </div>
          {isCopied && (
            <div className="notion-code-copy-tooltip">
              <div>Copied</div>
            </div>
          )}
        </div>
        <div className="notion-code-text">{content}</div>
      </div>
      {caption && (
        <figcaption className="notion-asset-caption">{caption}</figcaption>
      )}
    </>
  )
}
