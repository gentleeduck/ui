export function groupArrays<T>(numbers: number[], arr: T[]): T[][] {
  const result: T[][] = []
  let index = 0

  for (const num of numbers) {
    const headerGroup = arr.slice(index, index + num)
    result.push(headerGroup)
    index += num
  }

  return result
}
