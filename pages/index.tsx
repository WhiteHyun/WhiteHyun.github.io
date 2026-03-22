import * as React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import BodyClassName from 'react-body-classname'

import * as config from '@/lib/config'
import { getPublishedPosts } from '@/lib/notion-official'
import { useDarkMode } from '@/lib/use-dark-mode'
import { Footer } from '@/components/Footer'

interface Post {
  id: string
  title: string
  slug: string
  date: string
  tags: string[]
  category: string
  icon?: string
}

export const getStaticProps = async () => {
  const posts = await getPublishedPosts()
  return { props: { posts }, revalidate: 10 }
}

export default function HomePage({ posts }: { posts: Post[] }) {
  const { isDarkMode } = useDarkMode()

  // Group posts by category
  const categories = new Map<string, Post[]>()
  for (const post of posts) {
    const cat = post.category || 'Uncategorized'
    if (!categories.has(cat)) categories.set(cat, [])
    categories.get(cat)!.push(post)
  }

  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <meta name='description' content={config.description} />
        <meta property='og:title' content={config.name} />
        <meta property='og:description' content={config.description} />
        <meta property='og:site_name' content={config.name} />
        <link rel='canonical' href={`https://${config.domain}`} />
        <title>{config.name}</title>
      </Head>

      {isDarkMode && <BodyClassName className='dark-mode' />}

      <div className='notion-viewport'>
        <div className='notion-frame'>
          <div className='notion-page-scroller'>
            <main className='notion-page notion-page-no-cover notion-page-no-icon notion-full-page index-page'>
              <h1 className='notion-title' style={{ marginBottom: '2em' }}>
                {config.name}
              </h1>

              <div className='notion-page-content'>
                <div className='notion-page-content-inner'>
                  <div className='post-list'>
                    {posts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/${post.slug}`}
                        className='post-item'
                      >
                        <div className='post-icon'>
                          {post.icon || '📄'}
                        </div>
                        <div className='post-info'>
                          <span className='post-title'>{post.title}</span>
                          <div className='post-meta'>
                            {post.date && (
                              <time className='post-date'>{post.date}</time>
                            )}
                            {post.category && (
                              <span className='post-category'>{post.category}</span>
                            )}
                            {post.tags.map((tag) => (
                              <span key={tag} className='post-tag'>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            <Footer />
          </div>
        </div>
      </div>

      <style jsx>{`
        .post-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          width: 100%;
        }
        .post-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 4px;
          text-decoration: none;
          color: inherit;
          border-radius: 4px;
          transition: background 80ms ease-in;
        }
        .post-item:hover {
          background: var(--select-color-0, rgba(55, 53, 47, 0.08));
        }
        :global(.dark-mode) .post-item:hover {
          background: rgba(255, 255, 255, 0.055);
        }
        .post-icon {
          font-size: 1.2em;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .post-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .post-title {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          color: rgb(55, 53, 47);
        }
        :global(.dark-mode) .post-title {
          color: rgba(255, 255, 255, 0.81);
        }
        .post-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(55, 53, 47, 0.65);
        }
        :global(.dark-mode) .post-meta {
          color: rgba(255, 255, 255, 0.443);
        }
        .post-date {
          font-size: 12px;
        }
        .post-category {
          background: rgba(35, 131, 226, 0.14);
          color: rgb(35, 131, 226);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 500;
        }
        .post-tag {
          background: rgba(55, 53, 47, 0.06);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
        }
        :global(.dark-mode) .post-tag {
          background: rgba(255, 255, 255, 0.07);
        }
      `}</style>
    </>
  )
}
