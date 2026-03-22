// Simple in-memory key-value store for build-time caching
// Replaces Keyv to avoid localStorage SSR issues
const store = new Map<string, any>()

export const db = {
  async get(key: string) {
    return store.get(key)
  },
  async set(key: string, value: any, _ttl?: number) {
    store.set(key, value)
  }
}
