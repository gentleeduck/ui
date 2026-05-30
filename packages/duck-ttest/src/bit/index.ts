// Fixed-length little-endian bit tuples. Tuple form because TS doesn't model
// numbers as binary — converting an int to bits costs recursion depth per bit.

import type { Add as _Add, Dec as _Dec } from '~/_internal/arith'

export type Bit = 0 | 1

/** Bitwise AND of two same-length bit tuples. */
export type BitAnd<A extends readonly Bit[], B extends readonly Bit[]> = A extends readonly [
  infer AH extends Bit,
  ...infer AR extends Bit[],
]
  ? B extends readonly [infer BH extends Bit, ...infer BR extends Bit[]]
    ? [AH extends 1 ? (BH extends 1 ? 1 : 0) : 0, ...BitAnd<AR, BR>]
    : []
  : []

/** Bitwise OR of two same-length bit tuples. */
export type BitOr<A extends readonly Bit[], B extends readonly Bit[]> = A extends readonly [
  infer AH extends Bit,
  ...infer AR extends Bit[],
]
  ? B extends readonly [infer BH extends Bit, ...infer BR extends Bit[]]
    ? [AH extends 1 ? 1 : BH extends 1 ? 1 : 0, ...BitOr<AR, BR>]
    : []
  : []

/** Bitwise XOR of two same-length bit tuples. */
export type BitXor<A extends readonly Bit[], B extends readonly Bit[]> = A extends readonly [
  infer AH extends Bit,
  ...infer AR extends Bit[],
]
  ? B extends readonly [infer BH extends Bit, ...infer BR extends Bit[]]
    ? [AH extends BH ? 0 : 1, ...BitXor<AR, BR>]
    : []
  : []

/** Bitwise NOT (inversion) of a bit tuple. */
export type BitNot<A extends readonly Bit[]> = A extends readonly [infer H extends Bit, ...infer R extends Bit[]]
  ? [H extends 1 ? 0 : 1, ...BitNot<R>]
  : []

/** Population count: number of `1` bits. */
export type PopCount<A extends readonly Bit[], Acc extends unknown[] = []> = A extends readonly [
  infer H extends Bit,
  ...infer R extends Bit[],
]
  ? PopCount<R, H extends 1 ? [...Acc, unknown] : Acc>
  : Acc['length'] & number

/** Little-endian bit tuple → number. */
export type FromBits<B extends readonly Bit[]> = _FromBits<B, 1, 0>
type _FromBits<B extends readonly Bit[], Weight extends number, Acc extends number> = B extends readonly [
  infer H extends Bit,
  ...infer R extends Bit[],
]
  ? _FromBits<R, _Add<Weight, Weight>, H extends 1 ? _Add<Acc, Weight> : Acc>
  : Acc

/**
 * Left shift by `K`, fixed length: drops highest-order bits, fills right with `0`.
 */
export type ShiftLeft<A extends readonly Bit[], K extends number> = K extends 0
  ? A extends Bit[]
    ? A
    : [...A]
  : A extends readonly [...infer Init extends Bit[], Bit]
    ? ShiftLeft<[0, ...Init], _Dec<K>>
    : A

/** Right shift by `K`, fixed length: fills left with `0`. */
export type ShiftRight<A extends readonly Bit[], K extends number> = K extends 0
  ? A extends Bit[]
    ? A
    : [...A]
  : A extends readonly [Bit, ...infer Rest extends Bit[]]
    ? ShiftRight<[...Rest, 0], _Dec<K>>
    : A
