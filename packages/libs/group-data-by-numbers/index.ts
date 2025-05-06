export function groupDataByNumbers<T>(strings: T[], groupSizes: number[]): T[][] {
  const result: T[][] = []
  let index = 0

  for (const size of groupSizes) {
    const group = strings.slice(index, index + size)
    result.push(group)
    index += size
  }

  return result
}
