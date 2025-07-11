import React from 'react'
import { type Atom } from './atom'
import { useStore } from './provider'
import type { ExtractAtomValue } from './types'
import { createStore } from './store'

type Options = Parameters<typeof useStore>[0] & {
  delay?: number
  unstable_promiseStatus?: boolean
}

export const store = createStore()
export function useAtomValue<Value>(atom: Atom<Value>, options?: Options): Awaited<Value>

export function useAtomValue<AtomType extends Atom<unknown>>(
  atom: AtomType,
  options?: Options,
): Awaited<ExtractAtomValue<AtomType>>

export function useAtomValue<Value>(atom: Atom<Value>, options?: Options) {
  return React.useSyncExternalStore(
    (callback) => store.subscribe(atom, callback),
    () => store.get(atom),
  )
}
