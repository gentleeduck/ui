const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/
const LONG_FORM_DATE_RE = /^[a-z]{3,}\s+\d{1,2},\s+\d{4}$/i

/**
 * Parse `"today"`, `"tomorrow"`, `"next week"`, `"in N days"`, ISO-8601, or `"August 10, 2025"`.
 * Returns `null` for ambiguous inputs like `"5"`, `"Dec"`, `"2025"` (would cross-runtime-coerce).
 */
export function parseDate(input: string): Date | null {
  const normalized = input.trim().toLowerCase()

  if (normalized === 'today') return new Date()

  if (normalized === 'tomorrow') {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date
  }

  if (normalized === 'next week') {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date
  }

  const inXDaysMatch = normalized.match(/^in (\d+) days?$/)
  if (inXDaysMatch) {
    const [, captured = ''] = inXDaysMatch
    const date = new Date()
    date.setDate(date.getDate() + parseInt(captured, 10))
    return date
  }

  const trimmed = input.trim()
  if (ISO_DATE_RE.test(trimmed) || LONG_FORM_DATE_RE.test(trimmed)) {
    const parsed = new Date(trimmed)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return null
}
