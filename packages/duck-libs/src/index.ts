export { cn } from './cn'
export { filteredObject } from './filtered-object'
export { groupArrays } from './group-array'
export { groupDataByNumbers } from './group-data-by-numbers'
export { parseDate } from './parse-date'

/**
 * Generate a URL-safe slug from Arabic (or mixed) text.
 *
 * @param text - The input string to slugify.
 * @returns A hyphen-separated slug containing only Arabic letters, Latin
 *          alphanumerics, and hyphens.
 */
export function generateArabicSlug(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0623-\u064Aa-zA-Z0-9-]/g, '')
}

/**
 * Return today's date formatted as `YYYY-MM-DD`.
 */
export function getTodayDate(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
