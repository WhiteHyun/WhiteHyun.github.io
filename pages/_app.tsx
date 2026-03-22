// core styles shared by all of react-notion-x (required)
import 'react-notion-x/styles.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// global styles shared across the entire site
import 'styles/global.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'

import type { AppProps } from 'next/app'

import { bootstrap } from '@/lib/bootstrap-client'
import { isServer } from '@/lib/config'

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
