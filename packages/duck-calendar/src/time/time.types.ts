/** A time value with hour, minute, and optional second. */
export interface TimeValue {
  /** 0–23 */
  hour: number
  /** 0–59 */
  minute: number
  /** 0–59 (optional) */
  second?: number
}

/** Which time field is being edited. */
export type TimeField = 'hour' | 'minute' | 'second' | 'ampm'

/** Whether to display 12-hour or 24-hour format. */
export type HourCycle = '12' | '24'

/** Configuration for the time picker. */
export interface TimePickerConfig {
  /** Controlled time value. */
  value?: TimeValue
  /** Default time value for uncontrolled usage. */
  defaultValue?: TimeValue
  /** Called when the time changes. */
  onChange?: (value: TimeValue) => void
  /** 12-hour or 24-hour display. Default `'24'`. */
  hourCycle?: HourCycle
  /** Whether to show the seconds field. Default `false`. */
  showSeconds?: boolean
  /** Minimum selectable time. */
  minTime?: TimeValue
  /** Maximum selectable time. */
  maxTime?: TimeValue
  /** Step increment for minutes. Default `1`. */
  minuteStep?: number
  /** Step increment for seconds. Default `1`. */
  secondStep?: number
}
