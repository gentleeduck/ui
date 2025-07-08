import type { Atom, WritableAtom } from './atom'

type Listener = () => void

type Store = {
  get<Value>(atom: Atom<Value>): Value
  set<Value, Args extends unknown[], Result>(atom: WritableAtom<Value, Args, Result>, ...args: Args): Result
  subscribe(atom: Atom<unknown>, listener: Listener): () => void
}

export function createStore(): Store {
  const stateMap = new Map<string, unknown>()
  const listenersMap = new Map<string, Set<Listener>>()

  const getKey = (atom: Atom<unknown>) => atom.toString()

  const get = <Value>(atom: Atom<Value>): Value => {
    const key = getKey(atom)
    if (!stateMap.has(key)) {
      // FIX: the options here should be typed
      const value = atom.read(get, {} as never)
      stateMap.set(key, value)
    }
    return stateMap.get(key) as Value
  }

  const set = <Value, Args extends unknown[], Result>(
    atom: WritableAtom<Value, Args, Result>,
    ...args: Args
  ): Result => {
    const key = getKey(atom)
    const result = atom.write(get, set, ...args)
    if ('initValue' in atom) {
      const nextValue = get(atom)
      stateMap.set(key, nextValue)
    }
    listenersMap.get(key)?.forEach((listener) => listener())
    return result
  }

  const subscribe = (_atom: Atom<unknown>, listener: Listener): (() => void) => {
    const key = getKey(_atom)
    const setForKey = listenersMap.get(key) ?? new Set<Listener>()
    setForKey.add(listener)
    listenersMap.set(key, setForKey)
    return () => {
      setForKey.delete(listener)
      if (setForKey.size === 0) listenersMap.delete(key)
    }
  }

  return { get, set, subscribe }
}

const store = createStore()

export function useStore() {
  return store
}
