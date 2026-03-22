export default {
  async rewrites() {
    return {
      afterFiles: [
        // Proxy Notion API calls (client-side JS needs these)
        {
          source: '/api/v3/:path*',
          destination: 'https://www.notion.so/api/v3/:path*'
        },
        // Proxy Notion assets
        {
          source: '/_assets/:path*',
          destination: 'https://www.notion.so/_assets/:path*'
        }
      ]
    }
  }
}
