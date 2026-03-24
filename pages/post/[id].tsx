import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { getPage } from '../../lib/notion'
import { useDarkMode } from '../../lib/useDarkMode'
import type { ExtendedRecordMap } from 'notion-types'

// react-notion-x를 동적 import (SSR에서 window 참조 방지)
const NotionRenderer = dynamic(
  () => import('react-notion-x').then((m) => m.NotionRenderer),
  { ssr: false }
)

// 코드 하이라이팅
const Code = dynamic(
  () => import('react-notion-x/build/third-party/code').then((m) => m.Code),
  { ssr: false }
)

// 수식 렌더링
const Equation = dynamic(
  () => import('react-notion-x/build/third-party/equation').then((m) => m.Equation),
  { ssr: false }
)

// 데이터베이스/테이블 뷰
const Collection = dynamic(
  () => import('react-notion-x/build/third-party/collection').then((m) => m.Collection),
  { ssr: false }
)

// PDF 임베드
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  { ssr: false }
)

// 페이지 링크 모달
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  { ssr: false }
)

interface Props {
  recordMap: ExtendedRecordMap
  title: string
}

// Notion 내부 페이지 링크를 블로그 경로로 매핑
function mapPageUrl(pageId: string): string {
  return `/post/${pageId}`
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const pageId = params?.id as string

  try {
    const recordMap = await getPage(pageId)

    // recordMap에서 페이지 제목 추출
    const blockEntry = Object.values(recordMap.block)[0] as any
    const block = blockEntry?.value
    const title =
      block?.properties?.title?.flat()?.join('') || 'WhiteHyun Blog'

    return { props: { recordMap, title } }
  } catch {
    return { notFound: true }
  }
}

export default function Post({ recordMap, title }: Props) {
  const isDark = useDarkMode()

  return (
    <>
      <Head>
        <title>{`${title} - WhiteHyun Blog`}</title>
      </Head>

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={isDark}
        disableHeader={true}
        mapPageUrl={mapPageUrl}
        components={{ Code, Equation, Collection, Pdf, Modal }}
      />
    </>
  )
}
