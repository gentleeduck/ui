import React from 'react'
import type { WritableAtom } from '../primitive/atom'
import type { ExtractAtomArgs, ExtractAtomResult } from '../primitive/types'
import { useStore } from './provider'

type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result
type Options = Parameters<typeof useStore>[0]

export function useSetAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  options?: Options,
): SetAtom<Args, Result>

export function useSetAtom<AtomType extends WritableAtom<unknown, never[], unknown>>(
  atom: AtomType,
  options?: Options,
): SetAtom<ExtractAtomArgs<AtomType>, ExtractAtomResult<AtomType>>

export function useSetAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  options?: Options,
) {
  const store = useStore(options)
  return React.useCallback((...args: Args) => store.set(atom, ...args), [atom])
}
