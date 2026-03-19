/** Cache Intl.NumberFormat instances to avoid recreating formatters on every render. */
const NUMBER_FORMAT_CACHE = new Map<string, Intl.NumberFormat>()

export function getCachedNumberFormat(locale: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = options ? `${locale}|${JSON.stringify(options)}` : locale
  let fmt = NUMBER_FORMAT_CACHE.get(key)
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, options)
    NUMBER_FORMAT_CACHE.set(key, fmt)
  }
  return fmt
}
