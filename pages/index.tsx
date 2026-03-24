import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { getDatabasePosts, type PostMeta } from '../lib/notion'
import { useDarkMode } from '../lib/useDarkMode'

interface Props {
  posts: PostMeta[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const posts = await getDatabasePosts()
  return { props: { posts } }
}

export default function Home({ posts }: Props) {
  const isDark = useDarkMode()

  return (
    <>
      <Head>
        <title>WhiteHyun Blog</title>
        <meta name="description" content="WhiteHyun의 기술 블로그" />
      </Head>

      <div style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '40px 20px',
        color: isDark ? '#fff' : '#000',
        backgroundColor: isDark ? '#191919' : '#fff',
        minHeight: '100vh',
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 40 }}>
          WhiteHyun Blog
        </h1>

        <div>
          {posts.map((post) => (
            <article key={post.id} style={{ marginBottom: 32 }}>
              <Link
                href={`/post/${post.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
                  {post.title}
                </h2>
                {post.description && (
                  <p style={{ color: isDark ? '#999' : '#666', fontSize: 14, marginBottom: 4 }}>
                    {post.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13, color: isDark ? '#666' : '#999' }}>
                  <span>
                    {new Date(post.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  {post.tags.length > 0 && (
                    <span>{post.tags.join(', ')}</span>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
