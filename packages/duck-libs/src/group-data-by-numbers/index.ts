import { chunkByCounts } from '../chunk-by-counts'

/** @deprecated Use {@link chunkByCounts}. */
export function groupDataByNumbers<T>(strings: readonly T[], groupSizes: readonly number[]): T[][] {
  return chunkByCounts(strings, groupSizes)
}
