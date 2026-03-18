import type { DateAdapter } from '../../adapter'
import type { CalendarLocaleConfig } from '../../index.types'
import type { HourCycle } from '../../time'
import type { UseCalendarReturn } from '../use-calendar/use-calendar.types'
import type { UseTimePickerReturn } from '../use-time-picker/use-time-picker.types'

export interface UseDateTimeConfig<TDate> {
  adapter: DateAdapter<TDate>
  locale?: CalendarLocaleConfig
  value?: TDate
  defaultValue?: TDate
  onChange?: (value: TDate) => void
  hourCycle?: HourCycle
  showSeconds?: boolean
  // Calendar-specific
  month?: TDate
  defaultMonth?: TDate
  onMonthChange?: (month: TDate) => void
  disabled?: TDate[] | ((date: TDate) => boolean)
  fromDate?: TDate
  toDate?: TDate
  onDismiss?: () => void
}

export interface UseDateTimeReturn<TDate> {
  calendar: UseCalendarReturn<TDate, 'single'>
  timePicker: UseTimePickerReturn
  state: {
    value: TDate | null
  }
  actions: {
    setValue: (value: TDate) => void
  }
}
