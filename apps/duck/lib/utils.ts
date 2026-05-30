export { filteredObject } from '@gentleduck/libs/filtered-object'
export { groupArrays } from '@gentleduck/libs/group-array'
export { groupDataByNumbers } from '@gentleduck/libs/group-data-by-numbers'

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
