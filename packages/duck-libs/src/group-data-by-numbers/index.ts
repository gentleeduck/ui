/**
 * Partition `strings` into consecutive groups whose sizes are defined by
 * `groupSizes`.
 *
 * @param strings    - The items to partition.
 * @param groupSizes - The size of each group.
 * @returns An array of sub-arrays.
 */
export function groupDataByNumbers<T>(strings: readonly T[], groupSizes: readonly number[]): T[][] {
  const result: T[][] = []
  let index = 0

  for (const size of groupSizes) {
    const group = strings.slice(index, index + size)
    result.push(group)
    index += size
  }

  return result
}
