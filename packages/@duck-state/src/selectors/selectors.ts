// src/selector.ts
import { Atom } from '../atom'

export function selector<T>(getter: () => T, dependencies: Atom<any>[]): Atom<T> {
  let value = getter()
  const listeners = new Set<() => void>()

  // biome-ignore lint/complexity/noForEach: <explanation>
  dependencies.forEach((dep) =>
    dep.subscribe(() => {
      value = getter()
      // biome-ignore lint/complexity/noForEach: <explanation>
      listeners.forEach((listener) => listener())
    }),
  )

  return {
    get: () => value,
    set: () => {}, // Read-only
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
