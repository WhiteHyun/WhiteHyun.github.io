import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { getDatabasePosts, getPage } from '../../lib/notion'
import { NotionRenderer } from '../../components/notion/NotionRenderer'
import type { ExtendedRecordMap } from 'notion-types'

interface Props {
  recordMap: ExtendedRecordMap
  title: string
}

function normalizeId(id: string): string {
  if (id.includes('-')) return id
  // 8-4-4-4-12 UUID format
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`
}

function mapPageUrl(pageId: string): string {
  return `/post/${normalizeId(pageId)}`
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getDatabasePosts()
  const paths = posts.map((post) => ({ params: { id: post.id } }))
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const pageId = params?.id as string

  try {
    const recordMap = await getPage(pageId)

    const blockEntry = Object.values(recordMap.block)[0] as any
    const raw = blockEntry?.value
    const block = raw?.type ? raw : raw?.value
    const title =
      block?.properties?.title?.flat()?.join('') || 'WhiteHyun Blog'

    return { props: { recordMap, title }, revalidate: 86400 }
  } catch {
    return { notFound: true }
  }
}

export default function Post({ recordMap, title }: Props) {
  return (
    <>
      <Head>
        <title>{`${title} - WhiteHyun Blog`}</title>
      </Head>

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        mapPageUrl={mapPageUrl}
      />
    </>
  )
}
