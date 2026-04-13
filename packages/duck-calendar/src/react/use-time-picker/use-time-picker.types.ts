import type { HourCycle, ITimePickerConfig, ITimeValue, TimeField } from '../../time'

export interface IUseTimePickerConfig extends ITimePickerConfig {}

export interface ITimeFieldProps {
  role: 'spinbutton'
  'aria-label': string
  'aria-valuemin': number
  'aria-valuemax': number
  'aria-valuenow': number
  'aria-valuetext': string
  tabIndex: 0 | -1
  'data-slot': string
  'data-focused': 'true' | undefined
  onKeyDown: React.KeyboardEventHandler
  onFocus: () => void
}

export interface IUseTimePickerReturn {
  state: {
    value: ITimeValue
    focusedField: TimeField
    hourCycle: HourCycle
    displayHour: number
    displayAmPm: 'AM' | 'PM'
  }
  actions: {
    setValue: (value: ITimeValue) => void
    setField: (field: TimeField, value: number) => void
    increment: (field: TimeField, delta?: number) => void
    decrement: (field: TimeField, delta?: number) => void
    toggleAmPm: () => void
    focusField: (field: TimeField) => void
  }
  getFieldProps: (field: TimeField) => ITimeFieldProps
}
