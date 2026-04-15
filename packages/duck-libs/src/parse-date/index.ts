/**
 * Parse a human-friendly date string into a `Date` object.
 *
 * Supported inputs include `"today"`, `"tomorrow"`, `"next week"`,
 * `"in N days"`, and any string accepted by the `Date` constructor.
 *
 * @param input - The date string to parse.
 * @returns The resolved `Date`, or `null` if parsing fails.
 */
export function parseDate(input: string): Date | null {
  const now = new Date()
  const normalized = input.trim().toLowerCase()

  if (normalized === 'today') return now

  if (normalized === 'tomorrow') {
    const date = new Date(now)
    date.setDate(now.getDate() + 1)
    return date
  }

  if (normalized === 'next week') {
    const date = new Date(now)
    date.setDate(now.getDate() + 7)
    return date
  }

  const inXDaysMatch = normalized.match(/^in (\d+) days?$/)
  if (inXDaysMatch) {
    const days = parseInt(inXDaysMatch[1] ?? '', 10)
    if (!Number.isNaN(days)) {
      const date = new Date(now)
      date.setDate(now.getDate() + days)
      return date
    }
  }

  // Fallback: delegate to the Date constructor for natural date strings
  const parsed = new Date(input)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed
  }

  return null
}
