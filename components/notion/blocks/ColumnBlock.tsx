import type { Block } from 'notion-types'

interface ColumnListProps {
  children?: React.ReactNode
}

export function ColumnListBlock({ children }: ColumnListProps) {
  return <div className="notion-row">{children}</div>
}

interface ColumnProps {
  block: Block
  children?: React.ReactNode
}

export function ColumnBlock({ block, children }: ColumnProps) {
  const ratio = (block.format as any)?.column_ratio || 1
  const style: React.CSSProperties = { flex: ratio }

  return (
    <div className="notion-column" style={style}>
      {children}
    </div>
  )
}
