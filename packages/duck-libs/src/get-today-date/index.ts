/** Today as `YYYY-MM-DD` in LOCAL tz. For UTC use `new Date().toISOString().slice(0, 10)`. */
export function getTodayDate(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
