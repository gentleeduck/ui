import React from 'react'
import type { IAtom } from '../primitive/atom'
import type { ExtractAtomValue } from '../primitive/types'
import { useStore } from './provider'

/** @internal */
type Options = Parameters<typeof useStore>[0] & {
  delay?: number
  unstable_promiseStatus?: boolean
}

export function useAtomValue<Value>(atom: IAtom<Value>, options?: Options): Awaited<Value>

export function useAtomValue<AtomType extends IAtom<unknown>>(
  atom: AtomType,
  options?: Options,
): Awaited<ExtractAtomValue<AtomType>>

export function useAtomValue<Value>(atom: IAtom<Value>, options?: Options) {
  const store = useStore(options)

  return React.useSyncExternalStore(
    (callback) => store.subscribe(atom, callback),
    () => store.get(atom),
  )
}
