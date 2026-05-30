import { DIRECTION_DICTIONARY, type IDirection } from '@gentleduck/primitives/direction'

/** Narrow `dir` to `IDirection.Kind` via {@link DIRECTION_DICTIONARY}; invalid → undefined. */
export function toDirection(dir: unknown): IDirection.Kind | undefined {
  if (typeof dir !== 'string') return undefined
  return dir in DIRECTION_DICTIONARY ? (dir as IDirection.Kind) : undefined
}
