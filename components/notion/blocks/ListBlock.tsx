import type { Block } from 'notion-types'
import { NotionText } from '../NotionText'
import { getBlockTitle } from '../block-helpers'

const DISC_MARKERS = ['•', '◦', '▪']

function toLetterMarker(n: number): string {
  let result = ''
  let num = n
  while (num > 0) {
    num--
    result = String.fromCharCode(97 + (num % 26)) + result
    num = Math.floor(num / 26)
  }
  return result + '.'
}

function toRomanMarker(n: number): string {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const numerals = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i']
  let result = ''
  let num = n
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += numerals[i]
      num -= values[i]
    }
  }
  return result + '.'
}

const NUMBERED_FORMATTERS = [
  (n: number) => `${n}.`,
  toLetterMarker,
  toRomanMarker,
]

interface Props {
  block: Block
  type: 'disc' | 'numbered'
  listNumber?: number
  depth?: number
  children?: React.ReactNode
}

export function ListBlock({ block, type, listNumber, depth = 0, children }: Props) {
  const title = getBlockTitle(block)

  const marker = type === 'disc'
    ? DISC_MARKERS[depth % DISC_MARKERS.length]
    : NUMBERED_FORMATTERS[depth % NUMBERED_FORMATTERS.length](listNumber ?? 1)

  return (
    <div className={`notion-list-item ${type === 'disc' ? 'notion-list-disc' : 'notion-list-numbered'}`}>
      <div className="notion-list-item-marker">
        {marker}
      </div>
      <div className="notion-list-item-content">
        <NotionText value={title} />
        {children}
      </div>
    </div>
  )
}
