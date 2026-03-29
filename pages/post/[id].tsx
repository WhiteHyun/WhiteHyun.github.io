import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { getPage } from '../../lib/notion'
import { NotionRenderer } from '../../components/notion/NotionRenderer'
import type { ExtendedRecordMap } from 'notion-types'

interface Props {
  recordMap: ExtendedRecordMap
  title: string
}

function mapPageUrl(pageId: string): string {
  return `/post/${pageId}`
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const pageId = params?.id as string

  try {
    const recordMap = await getPage(pageId)

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
