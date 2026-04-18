import type { Adapter } from '../../adapter'
import type { Calendar } from '../../index.types'
import type { Time } from '../../time'
import type { UseCalendar } from '../use-calendar/use-calendar.types'
import type { UseTimePicker } from '../use-time-picker/use-time-picker.types'

export namespace UseDateTime {
  export interface IUseDateTimeConfig<TDate> {
    adapter: Adapter.IDateAdapter<TDate>
    locale?: Calendar.ICalendarLocaleConfig
    value?: TDate
    defaultValue?: TDate
    onChange?: (value: TDate) => void
    hourCycle?: Time.HourCycle
    showSeconds?: boolean
    month?: TDate
    defaultMonth?: TDate
    onMonthChange?: (month: TDate) => void
    disabled?: TDate[] | ((date: TDate) => boolean)
    fromDate?: TDate
    toDate?: TDate
    onDismiss?: () => void
  }

  export interface IUseDateTimeReturn<TDate> {
    calendar: UseCalendar.IUseCalendarReturn<TDate, 'single'>
    timePicker: UseTimePicker.IUseTimePickerReturn
    state: {
      value: TDate | null
    }
    actions: {
      setValue: (value: TDate) => void
    }
  }
}
