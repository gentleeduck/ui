import type { PersistenceAdapter } from './persistence.types'

export const LocalStorageAdapter: PersistenceAdapter = {
  load(key) {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(key)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  save(key, snapshot) {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(key, JSON.stringify(snapshot))
  },
  clear(key) {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(key)
  },
}
