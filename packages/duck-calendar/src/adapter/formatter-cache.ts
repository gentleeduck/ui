/** Shared Intl.DateTimeFormat cache to avoid re-instantiation on every format() call. */
const FORMATTER_CACHE = new Map<string, Intl.DateTimeFormat>()

export function getCachedFormatter(locale: string | undefined, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale ?? ''}|${JSON.stringify(options)}`
  let f = FORMATTER_CACHE.get(key)
  if (!f) {
    f = new Intl.DateTimeFormat(locale, options)
    FORMATTER_CACHE.set(key, f)
  }
  return f
}
