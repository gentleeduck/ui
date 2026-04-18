import type { Selection } from '@gentleduck/calendar'
import type { ICalendarProps, ICalendarSelectionValue } from './calendar.types'

const MAX_CACHE_SIZE = 20

/** Cache Intl.NumberFormat instances to avoid recreating formatters on every render. */
const NUMBER_FORMAT_CACHE = new Map<string, Intl.NumberFormat>()

export function callCalendarSelectHandler(
  mode: Selection.SelectionMode,
  onSelect: ICalendarProps['onSelect'],
  value: ICalendarSelectionValue,
) {
  if (!onSelect) return

  switch (mode) {
    case 'range':
      return (onSelect as ICalendarProps.IRange['onSelect'])?.(value as ICalendarSelectionValue<'range'>)
    case 'multi':
      return (onSelect as ICalendarProps.IMulti['onSelect'])?.(value as ICalendarSelectionValue<'multi'>)
    case 'multi-range':
      return (onSelect as ICalendarProps.IMultiRange['onSelect'])?.(value as ICalendarSelectionValue<'multi-range'>)
    case 'single':
      return (onSelect as ICalendarProps.ISingle['onSelect'])?.(value as ICalendarSelectionValue<'single'>)
  }
}

export function getCachedNumberFormat(locale: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = options ? `${locale}|${JSON.stringify(options)}` : locale
  let fmt = NUMBER_FORMAT_CACHE.get(key)
  if (fmt) {
    // LRU: move to end
    NUMBER_FORMAT_CACHE.delete(key)
    NUMBER_FORMAT_CACHE.set(key, fmt)
    return fmt
  }
  // Evict oldest if at capacity
  if (NUMBER_FORMAT_CACHE.size >= MAX_CACHE_SIZE) {
    const oldest = NUMBER_FORMAT_CACHE.keys().next().value
    if (oldest !== undefined) NUMBER_FORMAT_CACHE.delete(oldest)
  }
  fmt = new Intl.NumberFormat(locale, options)
  NUMBER_FORMAT_CACHE.set(key, fmt)
  return fmt
}
