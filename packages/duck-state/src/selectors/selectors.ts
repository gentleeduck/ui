import { Atom } from '../atom'

export function selector<T>(getter: () => T, dependencies: Atom<any>[]): Atom<T> {
  let value = getter()
  const listeners = new Set<(newValue: T) => void>()

  dependencies.forEach((dep) =>
    dep.subscribe(() => {
      const next = getter()
      if (Object.is(value, next)) return
      value = next
      listeners.forEach((listener) => listener(value))
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
