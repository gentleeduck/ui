/**
 * Format an hour number (0-23) to a display string (e.g. "9 AM", "12 PM").
 */
export function formatHour(h: number): string {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

/**
 * Parse a date string (YYYY-MM-DD) into a Date object at midnight local time.
 */
export function parseDateStr(s: string): Date | null {
  if (!s) return null
  const d = new Date(`${s}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * Convert a 12h time string ("9:00 AM") to 24h format ("09:00").
 */
export function timeStringTo24h(time: string): string {
  const m = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return '09:00'
  let h = Number.parseInt(m[1]!, 10)
  const min = m[2]!
  const p = m[3]!.toUpperCase()
  if (p === 'PM' && h !== 12) h += 12
  if (p === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${min}`
}

/**
 * Convert a 24h time string ("14:30") to 12h display ("2:30 PM").
 */
export function time24hToDisplay(t: string): string {
  const [hStr, mStr] = t.split(':')
  let h = Number.parseInt(hStr ?? '9', 10)
  const min = mStr ?? '00'
  const p = h >= 12 ? 'PM' : 'AM'
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return `${h}:${min} ${p}`
}
