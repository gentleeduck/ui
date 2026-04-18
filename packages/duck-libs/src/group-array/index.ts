/**
 * Split `arr` into consecutive groups whose sizes are given by `numbers`.
 *
 * @param numbers - The size of each group.
 * @param arr     - The array to partition.
 * @returns An array of sub-arrays.
 */
export function groupArrays<T>(numbers: readonly number[], arr: readonly T[]): T[][] {
  const result: T[][] = []
  let index = 0

  for (const num of numbers) {
    const headerGroup = arr.slice(index, index + num)
    result.push(headerGroup)
    index += num
  }

  return result
}
