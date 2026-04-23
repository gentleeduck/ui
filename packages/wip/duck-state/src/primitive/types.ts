import type { IAtom, IWritableAtom, PrimitiveAtom } from './atom.ts'

/** @internal */
export type Getter = Parameters<IAtom<unknown>['read']>[0]
/** @internal */
export type Setter = Parameters<IWritableAtom<unknown, unknown[], unknown>['write']>[1]

/** @internal */
export type ExtractAtomValue<AtomType> = AtomType extends IAtom<infer Value> ? Value : never

/** @internal */
export type ExtractAtomArgs<AtomType> =
  AtomType extends IWritableAtom<unknown, infer Args, infer _Result> ? Args : never

/** @internal */
export type ExtractAtomResult<AtomType> =
  AtomType extends IWritableAtom<unknown, infer _Args, infer Result> ? Result : never

/** @internal */
export type SetStateAction<Value> = ExtractAtomArgs<PrimitiveAtom<Value>>[0]
