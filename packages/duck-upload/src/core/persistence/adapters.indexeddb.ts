import type { PersistenceAdapter } from './persistence.types'

const DB_NAME = 'upload-engine'
const STORE = 'snapshots'
const VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'))
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction error'))
  })
}

export const IndexedDBAdapter: PersistenceAdapter = {
  async load(key) {
    if (typeof indexedDB === 'undefined') return null
    const db = await openDB()
    const tx = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)

    try {
      const value = await reqToPromise(store.get(key))
      await txDone(tx)
      return value ?? null
    } catch {
      try {
        await txDone(tx)
      } catch {
        // ignore
      }
      return null
    }
  },

  async save(key, snapshot) {
    if (typeof indexedDB === 'undefined') return
    const db = await openDB()
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)

    try {
      store.put(snapshot, key)
      await txDone(tx)
    } catch {
      try {
        tx.abort()
      } catch {
        // ignore
      }
    }
  },

  async clear(key) {
    if (typeof indexedDB === 'undefined') return
    const db = await openDB()
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)

    try {
      store.delete(key)
      await txDone(tx)
    } catch {
      try {
        tx.abort()
      } catch {
        // ignore
      }
    }
  },
}
