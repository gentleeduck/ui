import { useCallback, useEffect, useRef, useState } from 'react'
import { clampTime, incrementField, parseTimeInput } from '../../time/time'
import { formatTimeField, getAmPm, to12Hour, to24Hour } from '../../time/time.libs'
import type { Time } from '../../time/time.types'
import { useControllableState } from '../utils/use-controllable-state'
import type { UseTimePicker } from './use-time-picker.types'

// Pre-computed field orders for all 4 combinations  -  avoids filter() on every digit press.
// Keyed by `${hourCycle}_${showSeconds}` with a template literal type so the lookup
// is exhaustive at compile time and typos surface as TS errors instead of `undefined`.
type FieldOrderKey = `${Time.HourCycle}_${boolean}`
const FIELD_ORDERS: Record<FieldOrderKey, Time.TimeField[]> = {
  '24_false': ['hour', 'minute'],
  '24_true': ['hour', 'minute', 'second'],
  '12_false': ['hour', 'minute', 'ampm'],
  '12_true': ['hour', 'minute', 'second', 'ampm'],
}

function nextField(current: Time.TimeField, showSeconds: boolean, hourCycle: Time.HourCycle): Time.TimeField | null {
  const key: FieldOrderKey = `${hourCycle}_${showSeconds}`
  const available = FIELD_ORDERS[key]
  const idx = available.indexOf(current)
  if (idx < 0 || idx >= available.length - 1) return null
  return available[idx + 1] ?? null
}

const FIELD_LABELS: Record<Time.TimeField, string> = {
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  ampm: 'AM/PM',
}

function getFieldRange(
  field: Time.TimeField,
  hourCycle: '12' | '24',
  minTime?: Time.ITimeValue,
  maxTime?: Time.ITimeValue,
): { min: number; max: number } {
  switch (field) {
    case 'hour': {
      const base = hourCycle === '12' ? { min: 1, max: 12 } : { min: 0, max: 23 }
      if (minTime) base.min = Math.max(base.min, hourCycle === '12' ? to12Hour(minTime.hour) : minTime.hour)
      if (maxTime) base.max = Math.min(base.max, hourCycle === '12' ? to12Hour(maxTime.hour) : maxTime.hour)
      // Guard against contradictory constraints
      if (base.min > base.max) return hourCycle === '12' ? { min: 1, max: 12 } : { min: 0, max: 23 }
      return base
    }
    case 'minute':
      return { min: 0, max: 59 }
    case 'second':
      return { min: 0, max: 59 }
    case 'ampm':
      return { min: 0, max: 1 }
  }
}

function getFieldNow(field: Time.TimeField, value: Time.ITimeValue, hourCycle: '12' | '24'): number {
  switch (field) {
    case 'hour':
      return hourCycle === '12' ? to12Hour(value.hour) : value.hour
    case 'minute':
      return value.minute
    case 'second':
      return value.second ?? 0
    case 'ampm':
      return value.hour < 12 ? 0 : 1
  }
}

function getFieldText(field: Time.TimeField, value: Time.ITimeValue, hourCycle: '12' | '24'): string {
  switch (field) {
    case 'hour':
      return formatTimeField(hourCycle === '12' ? to12Hour(value.hour) : value.hour)
    case 'minute':
      return formatTimeField(value.minute)
    case 'second':
      return formatTimeField(value.second ?? 0)
    case 'ampm':
      return getAmPm(value.hour)
  }
}

export function useTimePicker(config: UseTimePicker.IUseTimePickerConfig = {}): UseTimePicker.IUseTimePickerReturn {
  const {
    value: controlledValue,
    defaultValue,
    onChange,
    hourCycle = '24',
    showSeconds = false,
    minTime,
    maxTime,
    minuteStep,
    secondStep,
  } = config

  const initialValue: Time.ITimeValue = defaultValue ?? { hour: 0, minute: 0 }

  const [value, setValueRaw] = useControllableState<Time.ITimeValue>(controlledValue, initialValue, onChange)

  const [focusedField, setFocusedField] = useState<Time.TimeField>('hour')

  // Digit-input buffer for typing 2-char field values; flushed on timeout or on length 2.
  const inputBuffer = useRef<string>('')
  const inputTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (inputTimeout.current) clearTimeout(inputTimeout.current)
    }
  }, [])

  const displayHour = hourCycle === '12' ? to12Hour(value.hour) : value.hour
  const displayAmPm = getAmPm(value.hour)

  const setValue = useCallback(
    (next: Time.ITimeValue) => {
      setValueRaw(next)
    },
    [setValueRaw],
  )

  const setField = useCallback(
    (field: Time.TimeField, fieldValue: number) => {
      const next = { ...value }
      switch (field) {
        case 'hour':
          // In 12h mode, convert displayed hour back to 24h using current AM/PM
          next.hour =
            hourCycle === '12' ? to24Hour(fieldValue === 0 ? 12 : fieldValue, getAmPm(value.hour)) : fieldValue
          break
        case 'minute':
          next.minute = fieldValue
          break
        case 'second':
          next.second = fieldValue
          break
        case 'ampm':
          // 0 = AM, 1 = PM  -  convert current hour accordingly
          next.hour = fieldValue === 0 ? value.hour % 12 : (value.hour % 12) + 12
          break
      }
      setValueRaw(clampTime(next, minTime, maxTime))
    },
    [value, setValueRaw, hourCycle, minTime, maxTime],
  )

  const increment = useCallback(
    (field: Time.TimeField, delta = 1) => {
      const next = incrementField(value, field, delta, { hourCycle, minuteStep, secondStep, minTime, maxTime })
      setValueRaw(next)
    },
    [value, setValueRaw, hourCycle, minuteStep, secondStep, minTime, maxTime],
  )

  const decrement = useCallback(
    (field: Time.TimeField, delta = 1) => {
      const next = incrementField(value, field, -delta, { hourCycle, minuteStep, secondStep, minTime, maxTime })
      setValueRaw(next)
    },
    [value, setValueRaw, hourCycle, minuteStep, secondStep, minTime, maxTime],
  )

  const toggleAmPm = useCallback(() => {
    const currentAmPm = getAmPm(value.hour)
    const hour12 = to12Hour(value.hour)
    const newAmPm = currentAmPm === 'AM' ? 'PM' : 'AM'
    const next = clampTime({ ...value, hour: to24Hour(hour12, newAmPm) }, minTime, maxTime)
    setValueRaw(next)
  }, [value, setValueRaw, minTime, maxTime])

  const focusField = useCallback((field: Time.TimeField) => {
    setFocusedField(field)
  }, [])

  const commitBuffer = useCallback(
    (field: Time.TimeField, buffer: string) => {
      const parsed = parseTimeInput(buffer, field, hourCycle)
      if (parsed !== null) {
        setField(field, parsed)
      }
      inputBuffer.current = ''
      const next = nextField(field, showSeconds, hourCycle)
      if (next) setFocusedField(next)
    },
    [hourCycle, showSeconds, setField],
  )

  const getFieldProps = useCallback(
    (field: Time.TimeField): UseTimePicker.ITimeFieldProps => {
      const range = getFieldRange(field, hourCycle, minTime, maxTime)
      const now = getFieldNow(field, value, hourCycle)
      const text = getFieldText(field, value, hourCycle)

      const onKeyDown: React.KeyboardEventHandler = (e) => {
        if (field === 'ampm') {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
            toggleAmPm()
            return
          }
          if (e.key === 'a' || e.key === 'A') {
            e.preventDefault()
            if (displayAmPm !== 'AM') toggleAmPm()
            return
          }
          if (e.key === 'p' || e.key === 'P') {
            e.preventDefault()
            if (displayAmPm !== 'PM') toggleAmPm()
            return
          }
          return
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault()
          increment(field)
          return
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          decrement(field)
          return
        }

        // Digit input buffering
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault()
          if (inputTimeout.current) clearTimeout(inputTimeout.current)
          inputBuffer.current += e.key

          if (inputBuffer.current.length >= 2) {
            commitBuffer(field, inputBuffer.current)
          } else {
            inputTimeout.current = setTimeout(() => {
              inputTimeout.current = null
              commitBuffer(field, inputBuffer.current)
            }, 500)
          }
        }
      }

      const onFocus = () => {
        setFocusedField(field)
        // Clear any pending buffer from previous field
        if (inputTimeout.current) clearTimeout(inputTimeout.current)
        inputBuffer.current = ''
      }

      return {
        role: 'spinbutton',
        'aria-label': FIELD_LABELS[field],
        'aria-valuemin': range.min,
        'aria-valuemax': range.max,
        'aria-valuenow': now,
        'aria-valuetext': text,
        tabIndex: focusedField === field ? 0 : -1,
        'data-slot': 'time-picker-field',
        'data-focused': focusedField === field ? 'true' : undefined,
        onKeyDown,
        onFocus,
      }
    },
    [value, focusedField, hourCycle, increment, decrement, toggleAmPm, commitBuffer, displayAmPm, minTime, maxTime],
  )

  return {
    state: {
      value,
      focusedField,
      hourCycle,
      displayHour,
      displayAmPm,
    },
    actions: {
      setValue,
      setField,
      increment,
      decrement,
      toggleAmPm,
      focusField,
    },
    getFieldProps,
  }
}
