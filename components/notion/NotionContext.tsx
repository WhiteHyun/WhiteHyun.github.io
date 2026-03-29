import { createContext, useContext } from 'react'
import type { ExtendedRecordMap } from 'notion-types'

export interface NotionContextValue {
  recordMap: ExtendedRecordMap
  mapPageUrl: (pageId: string) => string
}

const NotionContext = createContext<NotionContextValue | null>(null)

export function NotionProvider({
  recordMap,
  mapPageUrl,
  children,
}: NotionContextValue & { children: React.ReactNode }) {
  return (
    <NotionContext.Provider value={{ recordMap, mapPageUrl }}>
      {children}
    </NotionContext.Provider>
  )
}

export function useNotion(): NotionContextValue {
  const ctx = useContext(NotionContext)
  if (!ctx) throw new Error('useNotion must be used within NotionProvider')
  return ctx
}
