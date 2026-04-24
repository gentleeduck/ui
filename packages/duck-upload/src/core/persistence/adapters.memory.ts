import type { PersistenceAdapter } from './persistence.types'

const store = new Map<string, unknown>()

export const MemoryAdapter: PersistenceAdapter = {
  load(key) {
    return store.get(key) ?? null
  },
  save(key, snapshot) {
    store.set(key, snapshot)
  },
  clear(key) {
    store.delete(key)
  },
}
