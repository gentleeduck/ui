export * from './cn'
export * from './filtered-object'
export * from './group-array'
export * from './group-data-by-numbers'
export * from './parse-date'

export function generateArabicSlug(text: string) {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0623-\u064Aa-zA-Z0-9-]/g, '')
}

export function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
