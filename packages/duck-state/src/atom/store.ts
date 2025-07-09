import type { Atom, Getter, SetStateAction, Setter, WritableAtom } from './atom'

type Listener = () => void

export function createStore() {
  const atomState = new WeakMap<Atom<unknown>, unknown>()
  const listeners = new WeakMap<Atom<unknown>, Set<Listener>>()

  const store = {
    get<Value>(atom: Atom<Value>): Value {
      if ('initValue' in atom) {
        if (!atomState.has(atom)) {
          atomState.set(atom, atom.initValue)
        }
        return atomState.get(atom) as Value
      }

      return atom.read(store.get as Getter, {} as never)
    },

    set<Value, Args extends unknown[], Result>(atom: WritableAtom<Value, Args, Result>, ...args: Args): Result {
      if ('initValue' in atom && args.length === 1) {
        const update = args[0] as SetStateAction<Value>
        const prev = store.get(atom)
        const next = typeof update === 'function' ? (update as (prev: Value) => Value)(prev) : update

        atomState.set(atom, next)

        const l = listeners.get(atom)
        if (l) l.forEach((fn) => fn())

        return undefined as Result
      }

      const result = atom.write(store.get as Getter, store.set as Setter, ...args)

      const l = listeners.get(atom)
      if (l) l.forEach((fn) => fn())

      return result
    },

    subscribe<Value>(atom: Atom<Value>, listener: Listener): () => void {
      let atomListeners = listeners.get(atom)
      if (!atomListeners) {
        atomListeners = new Set()
        listeners.set(atom, atomListeners)
      }

      atomListeners.add(listener)

      if (atom.unstable_onInit && !atomState.has(atom)) {
        atom.unstable_onInit(store)
      }

      return () => {
        atomListeners!.delete(listener)
      }
    },

    // for debugging/testing
    _getRaw<Value>(atom: Atom<Value>): Value | undefined {
      return atomState.get(atom) as Value | undefined
    },

    _setRaw<Value>(atom: Atom<Value>, value: Value) {
      atomState.set(atom, value)
    },
  }

  return store
}
