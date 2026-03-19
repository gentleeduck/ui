import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CalendarValue } from '../../selection'
import type { TimeValue } from '../../time'
import { useCalendar } from '../use-calendar'
import { useTimePicker } from '../use-time-picker'
import type { UseDateTimeConfig, UseDateTimeReturn } from './use-datetime.types'

const DEFAULT_TIME: TimeValue = Object.freeze({ hour: 0, minute: 0, second: 0 })

/**
 * Composes `useCalendar` (single mode) and `useTimePicker` into a unified
 * datetime picker hook. Selecting a date preserves the current time, and
 * changing the time preserves the current date.
 */
export function useDateTime<TDate>(config: UseDateTimeConfig<TDate>): UseDateTimeReturn<TDate> {
  const {
    adapter,
    locale,
    value: controlledValue,
    defaultValue,
    onChange,
    hourCycle,
    showSeconds = false,
    month,
    defaultMonth,
    onMonthChange,
    disabled,
    fromDate,
    toDate,
    onDismiss,
  } = config

  // ---------------------------------------------------------------------------
  // Internal state  -  tracks the combined datetime
  // ---------------------------------------------------------------------------
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<TDate | null>(defaultValue ?? null)

  const currentValue = isControlled ? controlledValue : internalValue

  const setDateTime = useCallback(
    (next: TDate) => {
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  // ---------------------------------------------------------------------------
  // Extract time from the current value (memoized to avoid new objects each render)
  // ---------------------------------------------------------------------------
  const extractTime = useCallback(
    (date: TDate | null): TimeValue => {
      if (date == null) return DEFAULT_TIME
      return {
        hour: adapter.getHours(date),
        minute: adapter.getMinutes(date),
        second: adapter.getSeconds(date),
      }
    },
    [adapter],
  )

  const timeValue = useMemo(() => extractTime(currentValue), [currentValue, extractTime])

  // Keep a ref of the latest time so calendar selection can read it synchronously
  const timeRef = useRef<TimeValue>(timeValue)

  // Sync timeRef when the controlled value changes externally
  useEffect(() => {
    timeRef.current = timeValue
  }, [timeValue])

  // ---------------------------------------------------------------------------
  // useCalendar  -  single mode
  // ---------------------------------------------------------------------------
  const calendar = useCalendar<TDate, 'single'>({
    adapter,
    mode: 'single',
    locale,
    month,
    defaultMonth,
    onMonthChange,
    disabled,
    fromDate,
    toDate,
    onDismiss,
    selected: currentValue ?? undefined,
    onSelect: (selected: CalendarValue<TDate, 'single'>) => {
      if (selected == null) return
      const date = selected as TDate
      const t = timeRef.current
      const merged = adapter.setTime(date, t.hour, t.minute, t.second ?? 0)
      setDateTime(merged)
    },
  })

  // ---------------------------------------------------------------------------
  // useTimePicker
  // ---------------------------------------------------------------------------
  const timePicker = useTimePicker({
    value: timeValue,
    hourCycle,
    showSeconds,
    onChange: (newTime: TimeValue) => {
      timeRef.current = newTime
      if (currentValue != null) {
        const merged = adapter.setTime(currentValue, newTime.hour, newTime.minute, newTime.second ?? 0)
        setDateTime(merged)
      }
    },
  })

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------
  return {
    calendar,
    timePicker,
    state: {
      value: currentValue,
    },
    actions: {
      setValue: setDateTime,
    },
  }
}
