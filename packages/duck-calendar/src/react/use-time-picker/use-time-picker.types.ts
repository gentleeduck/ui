import type { HourCycle, TimeField, TimePickerConfig, TimeValue } from '../../time'

export interface UseTimePickerConfig extends TimePickerConfig {}

export interface TimeFieldProps {
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

export interface UseTimePickerReturn {
  state: {
    value: TimeValue
    focusedField: TimeField
    hourCycle: HourCycle
    displayHour: number
    displayAmPm: 'AM' | 'PM'
  }
  actions: {
    setValue: (value: TimeValue) => void
    setField: (field: TimeField, value: number) => void
    increment: (field: TimeField, delta?: number) => void
    decrement: (field: TimeField, delta?: number) => void
    toggleAmPm: () => void
    focusField: (field: TimeField) => void
  }
  getFieldProps: (field: TimeField) => TimeFieldProps
}
