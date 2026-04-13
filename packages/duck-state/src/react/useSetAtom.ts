import React from 'react'
import type { IWritableAtom } from '../primitive/atom'
import type { ExtractAtomArgs, ExtractAtomResult } from '../primitive/types'
import { useStore } from './provider'

/** @internal */
type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result
/** @internal */
type Options = Parameters<typeof useStore>[0]

export function useSetAtom<Value, Args extends unknown[], Result>(
  atom: IWritableAtom<Value, Args, Result>,
  options?: Options,
): SetAtom<Args, Result>

export function useSetAtom<AtomType extends IWritableAtom<unknown, never[], unknown>>(
  atom: AtomType,
  options?: Options,
): SetAtom<ExtractAtomArgs<AtomType>, ExtractAtomResult<AtomType>>

export function useSetAtom<Value, Args extends unknown[], Result>(
  atom: IWritableAtom<Value, Args, Result>,
  options?: Options,
) {
  const store = useStore(options)
  return React.useCallback((...args: Args) => store.set(atom, ...args), [atom])
}
