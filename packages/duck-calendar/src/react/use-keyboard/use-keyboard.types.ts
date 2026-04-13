import type { IDateAdapter, WeekStartDay } from '../../adapter'

export interface IKeyboardConfig<TDate> {
  focusedDate: TDate
  onFocusChange: (date: TDate) => void
  onSelect: (date: TDate, options?: { shiftKey?: boolean }) => void
  onDismiss?: () => void
  isDisabled: (date: TDate) => boolean
  adapter: IDateAdapter<TDate>
  weekStartDay?: WeekStartDay
}

export interface IKeyboardReturn {
  onKeyDown: React.KeyboardEventHandler
}
