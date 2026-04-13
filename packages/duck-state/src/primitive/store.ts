import type { IAtom, Getter, SetStateAction, Setter, IWritableAtom } from './atom'

/** @internal */
type Listener = () => void

export function createStore() {
  const atomState = new WeakMap<IAtom<unknown>, unknown>()
  const listeners = new WeakMap<IAtom<unknown>, Set<Listener>>()

  // Dependency maps
  const dependencies = new WeakMap<IAtom<unknown>, Set<IAtom<unknown>>>()
  const dependents = new WeakMap<IAtom<unknown>, Set<IAtom<unknown>>>()

  let currentlyReadingAtom: IAtom<unknown> | null = null

  function trackDependency(parent: IAtom<unknown>, dep: IAtom<unknown>) {
    let deps = dependencies.get(parent)
    if (!deps) {
      deps = new Set()
      dependencies.set(parent, deps)
    }
    deps.add(dep)

    let revDeps = dependents.get(dep)
    if (!revDeps) {
      revDeps = new Set()
      dependents.set(dep, revDeps)
    }
    revDeps.add(parent)
  }

  function invalidateDependents(atom: IAtom<unknown>) {
    const dependentsSet = dependents.get(atom)
    if (!dependentsSet) return

    for (const dependent of dependentsSet) {
      atomState.delete(dependent) // Invalidate cache
      invalidateDependents(dependent) // Recursively invalidate downstream
      const l = listeners.get(dependent)
      if (l) l.forEach((fn) => fn())
    }
  }

  const store = {
    // For testing/debugging
    _getRaw<Value>(atom: IAtom<Value>): Value | undefined {
      return atomState.get(atom) as Value | undefined
    },

    _setRaw<Value>(atom: IAtom<Value>, value: Value) {
      atomState.set(atom, value)
    },
    get<Value>(atom: IAtom<Value>): Value {
      if (currentlyReadingAtom) {
        trackDependency(currentlyReadingAtom, atom)
      }

      if ('initValue' in atom) {
        if (!atomState.has(atom)) {
          atomState.set(atom, atom.initValue)
        }
        return atomState.get(atom) as Value
      }

      // Memoized result
      if (atomState.has(atom)) {
        return atomState.get(atom) as Value
      }

      const prevReading = currentlyReadingAtom
      currentlyReadingAtom = atom

      const result = atom.read(store.get as Getter, {} as never)

      currentlyReadingAtom = prevReading

      atomState.set(atom, result)
      return result
    },

    set<Value, Args extends unknown[], Result>(atom: IWritableAtom<Value, Args, Result>, ...args: Args): Result {
      if ('initValue' in atom && args.length === 1) {
        const update = args[0] as SetStateAction<Value>
        const prev = store.get(atom)
        const next = typeof update === 'function' ? (update as (prev: Value) => Value)(prev) : update

        const isEqual = shallowEqual(prev, next)

        if (!isEqual) {
          atomState.set(atom, next)
          invalidateDependents(atom)

          const l = listeners.get(atom)
          if (l) l.forEach((fn) => fn())
        }

        return undefined as Result
      }

      const result = atom.write(store.get as Getter, store.set as Setter, ...args)

      if (!('initValue' in atom)) {
        // Derived atoms cache their read result; clear it so next read reflects writes.
        atomState.delete(atom)
      }

      invalidateDependents(atom)
      const l = listeners.get(atom)
      if (l) l.forEach((fn) => fn())

      return result
    },

    subscribe<Value>(atom: IAtom<Value>, listener: Listener): () => void {
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
  }

  return store
}

/** @internal */
function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!Object.is(a[i], b[i])) return false
    }
    return true
  }
  const objA = a as Record<string, unknown>
  const objB = b as Record<string, unknown>
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (!Object.is(objA[key], objB[key])) return false
  }
  return true
}

/**
 * TODO:
 *
 * 1. Dependency Tracking:
 *    - Track which atoms are accessed during a `read`.
 *    - When a base atom is updated, notify all derived atoms depending on it.
 *    - Cache computed values of derived atoms and invalidate on dependency change.
 *
 * 2. Derived Atom Caching:
 *    - Avoid recomputing derived atom values every time `get()` is called.
 *    - Store last computed value and its dependencies.
 *
 * 3. Lifecycle: onMount / onUnmount:
 *    - Support `onMount` in atoms for setup logic.
 *    - Call cleanup function when no subscribers are left.
 *
 * 4. Async Atoms:
 *    - Support atoms that return Promises.
 *    - Store and expose loading/error states (similar to Suspense).
 *
 * 5. Batched Notifications (Optional):
 *    - Consider batching listener calls using microtasks or animation frames.
 *    - Prevent redundant re-renders when multiple updates happen in quick succession.
 */
