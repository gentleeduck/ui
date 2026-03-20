import type { DateAdapter, WeekStartDay } from '../../adapter'

export interface KeyboardConfig<TDate> {
  focusedDate: TDate
  onFocusChange: (date: TDate) => void
  onSelect: (date: TDate) => void
  onDismiss?: () => void
  isDisabled: (date: TDate) => boolean
  adapter: DateAdapter<TDate>
  weekStartDay?: WeekStartDay
}

export interface KeyboardReturn {
  onKeyDown: React.KeyboardEventHandler
}
