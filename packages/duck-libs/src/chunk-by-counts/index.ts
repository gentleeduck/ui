/**
 * Split `arr` into consecutive groups whose sizes are given by `sizes`.
 * @example chunkByCounts(['a','b','c','d','e'], [2, 3]) // [['a','b'], ['c','d','e']]
 */
export function chunkByCounts<T>(arr: readonly T[], sizes: readonly number[]): T[][] {
  const result: T[][] = []
  let index = 0

  for (const size of sizes) {
    result.push(arr.slice(index, index + size))
    index += size
  }

  return result
}
