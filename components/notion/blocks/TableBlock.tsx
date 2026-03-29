import type { Block } from 'notion-types'
import { useNotion } from '../NotionContext'
import { NotionText } from '../NotionText'

interface TableProps {
  block: Block
  children?: React.ReactNode
}

export function TableBlock({ block, children }: TableProps) {
  return (
    <table className="notion-simple-table">
      <tbody>{children}</tbody>
    </table>
  )
}

interface TableRowProps {
  block: Block
}

export function TableRowBlock({ block }: TableRowProps) {
  const { recordMap } = useNotion()
  const properties = block.properties as any
  if (!properties) return null

  // Get column order from parent table block
  const parentBlock = recordMap.block[block.parent_id]
  const parentValue = (parentBlock as any)?.value
  const columnOrder: string[] = parentValue?.format?.table_block_column_order || []

  return (
    <tr className="notion-simple-table-row">
      {columnOrder.map((colId) => (
        <td key={colId} className="notion-simple-table-cell">
          <NotionText value={properties[colId]} />
        </td>
      ))}
    </tr>
  )
}
