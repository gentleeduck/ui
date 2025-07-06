// src/async.ts
import { atom, useAtom } from '../atom'

export function asyncAtom<T>(fetcher: () => Promise<T>) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const state = atom<{ loading: boolean; data: T | null; error: any }>({
    loading: true,
    data: null,
    error: null,
  })

  fetcher()
    .then((data) => state.set({ loading: false, data, error: null }))
    .catch((error) => state.set({ loading: false, data: null, error }))

  return state
}

// // React Hook for Async Atoms
// export function useAsyncAtom<T>(_asyncAtom: ReturnType<typeof asyncAtom>) {
//   return useAtom((fetcher: () => Promise<T>) => asyncAtom<T>(fetcher))
// }
//

export function useAsyncAtom<T>(fetcher: () => Promise<T>) {
  const atomInstance = asyncAtom(fetcher)
  return useAtom(atomInstance)
}

// // caller must pass in atom
// export function uuseAsyncAtom<T>(
//   atomInstance: ReturnType<typeof asyncAtom<T>>,
// ): ReturnType<typeof useAtom<T>> {
//   return useAtom(atomInstance)
// }
//
//
// let initialized = false
// function ensureInitialized() {
//   if (!initialized) {
//     value = getter()
//     initialized = true
//   }
// }
//
