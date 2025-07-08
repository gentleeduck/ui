export * from './atom'
export * from './hooks'
export * from './store'

// // hook APIs
//
// // utilities
// export function atomFamily<Key, T>(init: (key: Key) => Atom<T>): (key: Key) => Atom<T>
// export function effect(fn: (get: Getter) => void | (() => void)): void
// export function batch(fn: () => void): void
// export function selectAtom<A extends Atom<any>, R>(
//   base: A,
//   selector: (v: ReturnType<A["read"]>) => R
// ): Atom<R>
//
// // advanced
// export function getSnapshot(): Map<Atom<any>, any>
// export function restoreSnapshot(snapshot: Map<Atom<any>, any>): void
// export function persistAtom<T>(atom: Atom<T>, options: PersistOptions<T>): void
// export function debugAtom(atom: Atom<any>): DebugInfo
//
