import type { IDateAdapter } from '../../adapter'
import type { ICalendarLocaleConfig } from '../../index.types'
import type { HourCycle } from '../../time'
import type { IUseCalendarReturn } from '../use-calendar/use-calendar.types'
import type { IUseTimePickerReturn } from '../use-time-picker/use-time-picker.types'

export interface IUseDateTimeConfig<TDate> {
  adapter: IDateAdapter<TDate>
  locale?: ICalendarLocaleConfig
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

export interface IUseDateTimeReturn<TDate> {
  calendar: IUseCalendarReturn<TDate, 'single'>
  timePicker: IUseTimePickerReturn
  state: {
    value: TDate | null
  }
  actions: {
    setValue: (value: TDate) => void
  }
}
