import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Selection } from '../../selection'
import type { Time } from '../../time'
import { useCalendar } from '../use-calendar'
import { useTimePicker } from '../use-time-picker'
import type { UseDateTime } from './use-datetime.types'

const DEFAULT_TIME: Time.ITimeValue = Object.freeze({ hour: 0, minute: 0, second: 0 })

/**
 * Composes `useCalendar` (single mode) and `useTimePicker` into a unified
 * datetime picker hook. Selecting a date preserves the current time, and
 * changing the time preserves the current date.
 */
export function useDateTime<TDate>(config: UseDateTime.IUseDateTimeConfig<TDate>): UseDateTime.IUseDateTimeReturn<TDate> {
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

  // Stable ref for onChange to avoid cascading callback invalidation
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const setDateTime = useCallback(
    (next: TDate) => {
      if (!isControlled) setInternalValue(next)
      onChangeRef.current?.(next)
    },
    [isControlled],
  )

  // ---------------------------------------------------------------------------
  // Extract time from the current value (memoized to avoid new objects each render)
  // ---------------------------------------------------------------------------
  const extractTime = useCallback(
    (date: TDate | null): Time.ITimeValue => {
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
  const timeRef = useRef<Time.ITimeValue>(timeValue)

  // Sync timeRef when the controlled value changes externally
  useEffect(() => {
    timeRef.current = timeValue
  }, [timeValue])

  // ---------------------------------------------------------------------------
  // Stable callbacks for sub-hooks
  // ---------------------------------------------------------------------------
  const currentValueRef = useRef(currentValue)
  useEffect(() => {
    currentValueRef.current = currentValue
  }, [currentValue])

  const handleCalendarSelect = useCallback(
    (selected: Selection.CalendarValue<TDate, 'single'>) => {
      if (selected == null) return
      const date = selected as TDate
      const t = timeRef.current
      const merged = adapter.setTime(date, t.hour, t.minute, t.second ?? 0)
      setDateTime(merged)
    },
    [adapter, setDateTime],
  )

  const handleTimeChange = useCallback(
    (newTime: Time.ITimeValue) => {
      timeRef.current = newTime
      if (currentValueRef.current != null) {
        const merged = adapter.setTime(currentValueRef.current, newTime.hour, newTime.minute, newTime.second ?? 0)
        setDateTime(merged)
      }
    },
    [adapter, setDateTime],
  )

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
    onSelect: handleCalendarSelect,
  })

  // ---------------------------------------------------------------------------
  // useTimePicker
  // ---------------------------------------------------------------------------
  const timePicker = useTimePicker({
    value: timeValue,
    hourCycle,
    showSeconds,
    onChange: handleTimeChange,
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
