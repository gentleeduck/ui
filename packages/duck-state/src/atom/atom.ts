import { useSyncExternalStore } from 'react'

export type Atom<T> = {
  get: () => T
  set: (value: T) => void
  subscribe: (listener: (newValue: T) => void) => () => void
}

export function atom<T>(initialValue: T): Atom<T> {
  let value = initialValue
  const listeners = new Set<(newValue: T) => void>()

  return {
    get: () => value,
    set: (newValue: T) => {
      if (Object.is(value, newValue)) return // Prevent unnecessary updates
      value = newValue
      listeners.forEach((listener) => listener(newValue))
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

// Fine-Grained React Hook
export function useAtom<T>(atom: Atom<T>): [T, (value: T) => void] {
  const state = useSyncExternalStore((notify) => atom.subscribe(notify), atom.get)
  return [state, atom.set]
}
