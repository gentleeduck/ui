// 9 -> "9 AM", 12 -> "12 PM"
export function formatHour(h: number): string {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

// YYYY-MM-DD -> Date at midnight local time
export function parseDateStr(s: string): Date | null {
  if (!s) return null
  const d = new Date(`${s}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

// "9:00 AM" -> "09:00"
export function timeStringTo24h(time: string): string {
  const m = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return '09:00'
  let h = Number.parseInt(m[1] ?? '0', 10)
  const min = m[2] ?? '00'
  const p = m[3]?.toUpperCase()
  if (p === 'PM' && h !== 12) h += 12
  if (p === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${min}`
}

// "14:30" -> "2:30 PM"
export function time24hToDisplay(t: string): string {
  const [hStr, mStr] = t.split(':')
  let h = Number.parseInt(hStr ?? '9', 10)
  const min = mStr ?? '00'
  const p = h >= 12 ? 'PM' : 'AM'
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return `${h}:${min} ${p}`
}
