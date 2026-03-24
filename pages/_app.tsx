import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useDarkMode } from '../lib/useDarkMode'
import '../styles/notion.css'

export default function App({ Component, pageProps }: AppProps) {
  const isDark = useDarkMode()

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#191919' : '#fff'
    document.body.style.color = isDark ? '#f0efed' : '#2c2c2b'
  }, [isDark])

  return <Component {...pageProps} />
}
