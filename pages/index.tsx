import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'
import { getDatabasePosts, type PostMeta } from '../lib/notion'

const POSTS_PER_PAGE = 20

interface Props {
  posts: PostMeta[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const posts = await getDatabasePosts()
  return { props: { posts } }
}

export default function Home({ posts }: Props) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const visiblePosts = posts.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE)

  return (
    <>
      <Head>
        <title>WhiteHyun Blog</title>
        <meta name="description" content="WhiteHyun의 기술 블로그" />
      </Head>

      <div className="blog-home">
        <h1 className="blog-home-title">WhiteHyun Blog</h1>

        <div>
          {visiblePosts.map((post) => (
            <article key={post.id} className="blog-post-item">
              <Link href={`/post/${post.id}`} className="blog-post-link">
                <h2 className="blog-post-title">{post.title}</h2>
                {post.description && (
                  <p className="blog-post-desc">{post.description}</p>
                )}
                <div className="blog-post-meta">
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

        {totalPages > 1 && (
          <div className="blog-pagination">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
              className="blog-pagination-btn"
            >
              ← 이전
            </button>
            <span className="blog-pagination-info">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages - 1}
              className="blog-pagination-btn"
            >
              다음 →
            </button>
          </div>
        )}
      </div>
    </>
  )
}
