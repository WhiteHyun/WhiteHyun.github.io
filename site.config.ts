import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '0d637334ef66431eb8fb0ccd5e756583',

  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'WhiteHyun',
  domain: 'whitehyun.github.io',
  author: 'WhiteHyun',

  // open graph metadata (optional)
  description: 'WhiteHyun의 기술 블로그',

  // language
  language: 'ko',

  // social usernames (optional)
  github: 'WhiteHyun',

  // default notion icon and cover images for site-wide consistency (optional)
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // disable LQIP preview images for simpler static builds
  isPreviewImageSupportEnabled: false,

  // redis is not used for static export
  isRedisEnabled: false,

  // disable search (requires API routes not available in static export)
  isSearchEnabled: false,

  // map of notion page IDs to URL paths (optional)
  pageUrlOverrides: null,

  // use default notion navigation style
  navigationStyle: 'default'
})
