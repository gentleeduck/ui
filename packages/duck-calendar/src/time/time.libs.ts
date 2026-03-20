/** Pad a number to 2 digits. */
export function formatTimeField(value: number): string {
  return value.toString().padStart(2, '0')
}

/** Get AM or PM for a given 24-hour value. */
export function getAmPm(hour: number): 'AM' | 'PM' {
  return hour < 12 ? 'AM' : 'PM'
}

/** Convert 24-hour to 12-hour display value. 0->12, 13->1, etc. */
export function to12Hour(hour: number): number {
  if (hour === 0) return 12
  if (hour > 12) return hour - 12
  return hour
}

/** Convert 12-hour + AM/PM back to 24-hour. */
export function to24Hour(hour12: number, ampm: 'AM' | 'PM'): number {
  if (ampm === 'AM') {
    return hour12 === 12 ? 0 : hour12
  }
  return hour12 === 12 ? 12 : hour12 + 12
}
