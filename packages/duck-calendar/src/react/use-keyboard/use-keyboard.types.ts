import type { Adapter } from '../../adapter'

export namespace UseKeyboard {
  export interface IKeyboardConfig<TDate> {
    focusedDate: TDate
    onFocusChange: (date: TDate) => void
    onSelect: (date: TDate, options?: { shiftKey?: boolean }) => void
    onDismiss?: (() => void) | undefined
    isDisabled: (date: TDate) => boolean
    adapter: Adapter.IDateAdapter<TDate>
    weekStartDay?: Adapter.WeekStartDay | undefined
  }

  export interface IKeyboardReturn {
    onKeyDown: React.KeyboardEventHandler
  }
}
