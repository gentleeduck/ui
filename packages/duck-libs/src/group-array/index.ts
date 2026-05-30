import { chunkByCounts } from '../chunk-by-counts'

/** @deprecated Use {@link chunkByCounts} (param order is reversed). */
export function groupArrays<T>(numbers: readonly number[], arr: readonly T[]): T[][] {
  return chunkByCounts(arr, numbers)
}
