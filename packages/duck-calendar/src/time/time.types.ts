export namespace Time {
  /** A time value with hour, minute, and optional second. */
  export interface ITimeValue {
    /** 0-23 */
    hour: number
    /** 0-59 */
    minute: number
    /** 0-59 (optional) */
    second?: number
  }

  /** Which time field is being edited. */
  export type TimeField = 'hour' | 'minute' | 'second' | 'ampm'

  /** Whether to display 12-hour or 24-hour format. */
  export type HourCycle = '12' | '24'

  /** Configuration for the time picker. */
  export interface ITimePickerConfig {
    /** Controlled time value. */
    value?: ITimeValue | undefined
    /** Default time value for uncontrolled usage. */
    defaultValue?: ITimeValue | undefined
    /** Called when the time changes. */
    onChange?: ((value: ITimeValue) => void) | undefined
    /** 12-hour or 24-hour display. Default `'24'`. */
    hourCycle?: HourCycle | undefined
    /** Whether to show the seconds field. Default `false`. */
    showSeconds?: boolean | undefined
    /** Minimum selectable time. */
    minTime?: ITimeValue | undefined
    /** Maximum selectable time. */
    maxTime?: ITimeValue | undefined
    /** Step increment for minutes. Default `1`. */
    minuteStep?: number | undefined
    /** Step increment for seconds. Default `1`. */
    secondStep?: number | undefined
  }
}
