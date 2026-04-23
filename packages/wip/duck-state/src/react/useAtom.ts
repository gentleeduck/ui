import type { IAtom, IWritableAtom, PrimitiveAtom, SetStateAction } from '../primitive/atom'
import type { ExtractAtomArgs, ExtractAtomResult, ExtractAtomValue } from '../primitive/types'
import { useAtomValue } from './useAtomValue'
import { useSetAtom } from './useSetAtom'

/** @internal */
type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result

/** @internal */
type Options = Parameters<typeof useAtomValue>[1]

export function useAtom<Value, Args extends unknown[], Result>(
  atom: IWritableAtom<Value, Args, Result>,
  options?: Options,
): [Awaited<Value>, SetAtom<Args, Result>]

export function useAtom<Value>(
  atom: PrimitiveAtom<Value>,
  options?: Options,
): [Awaited<Value>, SetAtom<[SetStateAction<Value>], void>]

export function useAtom<Value>(atom: IAtom<Value>, options?: Options): [Awaited<Value>, never]

export function useAtom<AtomType extends IWritableAtom<unknown, never[], unknown>>(
  atom: AtomType,
  options?: Options,
): [Awaited<ExtractAtomValue<AtomType>>, SetAtom<ExtractAtomArgs<AtomType>, ExtractAtomResult<AtomType>>]

export function useAtom<AtomType extends IAtom<unknown>>(
  atom: AtomType,
  options?: Options,
): [Awaited<ExtractAtomValue<AtomType>>, never]

export function useAtom<Value, Args extends unknown[], Result>(
  atom: IAtom<Value> | IWritableAtom<Value, Args, Result>,
  options?: Options,
) {
  return [
    useAtomValue(atom, options),
    // We do wrong type assertion here, which results in throwing an error.
    useSetAtom(atom as IWritableAtom<Value, Args, Result>, options),
  ]
}
