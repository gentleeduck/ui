export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function absoluteUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gentleduck.org'

  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizedBase}${normalizedPath}`
}

/** @internal */
export const filteredObject = <T extends Record<string, unknown>>(keys: string[], obj: T): Partial<T> => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key))) as Partial<T>
}

/** @internal */
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

/** @internal */
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
