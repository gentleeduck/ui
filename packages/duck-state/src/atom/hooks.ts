import { useMemo, useSyncExternalStore } from 'react'
import { type Atom, atom, type PrimitiveAtom, type SetAtom, type WritableAtom } from '~/atom'
import { useStore } from '~/atom/store'
import type { ExtractAtomArgs, ExtractAtomResult, ExtractAtomValue, SetStateAction } from './types'

/* ================================== useAtomValue ===================================  */
export function useAtomValue<Value>(atom: Atom<Value>, options?: any): Awaited<Value>

export function useAtomValue<AtomType extends Atom<unknown>>(
  atom: AtomType,
  options?: any,
): Awaited<ExtractAtomValue<AtomType>>

export function useAtomValue<Value>(atom: Atom<Value>, options?: any) {
  const store = useStore()
  return useSyncExternalStore(
    (callback) => store.subscribe(atom, callback),
    () => store.get(atom),
  )
}

/* ================================== useSetAtom ===================================  */
export function useSetAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  options?: any,
): SetAtom<Args, Result>

export function useSetAtom<AtomType extends WritableAtom<unknown, never[], unknown>>(
  atom: AtomType,
  options?: any,
): SetAtom<ExtractAtomArgs<AtomType>, ExtractAtomResult<AtomType>>

export function useSetAtom<Args extends unknown[], Result>(atom: WritableAtom<unknown, Args, Result>) {
  const store = useStore()
  return useMemo(() => {
    return (...args: Args) => store.set(atom, ...args)
  }, [atom])
}

/* ================================== useAtom ===================================  */
type Options = Parameters<typeof useAtomValue>[1]

export function useAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  options?: Options,
): [Awaited<Value>, SetAtom<Args, Result>]

export function useAtom<Value>(
  atom: PrimitiveAtom<Value>,
  options?: Options,
): [Awaited<Value>, SetAtom<[SetStateAction<Value>], void>]

export function useAtom<Value>(atom: Atom<Value>, options?: Options): [Awaited<Value>, never]

export function useAtom<AtomType extends WritableAtom<unknown, never[], unknown>>(
  atom: AtomType,
  options?: Options,
): [Awaited<ExtractAtomValue<AtomType>>, SetAtom<ExtractAtomArgs<AtomType>, ExtractAtomResult<AtomType>>]

export function useAtom<AtomType extends Atom<unknown>>(
  atom: AtomType,
  options?: Options,
): [Awaited<ExtractAtomValue<AtomType>>, never]

export function useAtom<Value, Args extends unknown[], Result>(
  atom: Atom<Value> | WritableAtom<Value, Args, Result>,
  options?: Options,
) {
  return [
    useAtomValue(atom, options),
    // We do wrong type assertion here, which results in throwing an error.
    useSetAtom(atom as WritableAtom<Value, Args, Result>, options),
  ]
}
