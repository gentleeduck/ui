import React from 'react'
import type { Atom } from '../primitive/atom'
import type { ExtractAtomValue } from '../primitive/types'
import { useStore } from './provider'

type Options = Parameters<typeof useStore>[0] & {
  delay?: number
  unstable_promiseStatus?: boolean
}

export function useAtomValue<Value>(atom: Atom<Value>, options?: Options): Awaited<Value>

export function useAtomValue<AtomType extends Atom<unknown>>(
  atom: AtomType,
  options?: Options,
): Awaited<ExtractAtomValue<AtomType>>

export function useAtomValue<Value>(atom: Atom<Value>, options?: Options) {
  const store = useStore(options)
  // console.log(store)

  return React.useSyncExternalStore(
    (callback) => store.subscribe(atom, callback),
    () => store.get(atom),
  )
}
