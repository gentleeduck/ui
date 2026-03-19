import { useCallback, useEffect, useRef, useState } from 'react'
import { incrementField, parseTimeInput } from '../../time/time'
import { formatTimeField, getAmPm, to12Hour, to24Hour } from '../../time/time.libs'
import type { TimeField, TimeValue } from '../../time/time.types'
import { useControllableState } from '../utils/use-controllable-state'
import type { TimeFieldProps, UseTimePickerConfig, UseTimePickerReturn } from './use-time-picker.types'

// ---------------------------------------------------------------------------
// Field ordering for tab-through
// ---------------------------------------------------------------------------

// Pre-computed field orders for all 4 combinations (avoids filter() on every digit press)
const FIELD_ORDERS: Record<string, TimeField[]> = {
  '24_false': ['hour', 'minute'],
  '24_true': ['hour', 'minute', 'second'],
  '12_false': ['hour', 'minute', 'ampm'],
  '12_true': ['hour', 'minute', 'second', 'ampm'],
}

function nextField(current: TimeField, showSeconds: boolean, hourCycle: '12' | '24'): TimeField | null {
  const available = FIELD_ORDERS[`${hourCycle}_${showSeconds}`]!
  const idx = available.indexOf(current)
  if (idx < 0 || idx >= available.length - 1) return null
  return available[idx + 1]!
}

// ---------------------------------------------------------------------------
// ARIA helpers
// ---------------------------------------------------------------------------

const FIELD_LABELS: Record<TimeField, string> = {
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  ampm: 'AM/PM',
}

function getFieldRange(field: TimeField, hourCycle: '12' | '24'): { min: number; max: number } {
  switch (field) {
    case 'hour':
      return hourCycle === '12' ? { min: 1, max: 12 } : { min: 0, max: 23 }
    case 'minute':
    case 'second':
      return { min: 0, max: 59 }
    case 'ampm':
      return { min: 0, max: 1 }
  }
}

function getFieldNow(field: TimeField, value: TimeValue, hourCycle: '12' | '24'): number {
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

function getFieldText(field: TimeField, value: TimeValue, hourCycle: '12' | '24'): string {
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

// ---------------------------------------------------------------------------
// useTimePicker
// ---------------------------------------------------------------------------

export function useTimePicker(config: UseTimePickerConfig = {}): UseTimePickerReturn {
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

  const initialValue: TimeValue = defaultValue ?? { hour: 0, minute: 0 }

  const [value, setValueRaw] = useControllableState<TimeValue>(controlledValue, initialValue, onChange)

  const [focusedField, setFocusedField] = useState<TimeField>('hour')

  // Input buffering
  const inputBuffer = useRef<string>('')
  const inputTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup input timeout on unmount
  useEffect(() => {
    return () => {
      if (inputTimeout.current) clearTimeout(inputTimeout.current)
    }
  }, [])

  // Derived display values (trivial computations  -  no useMemo needed)
  const displayHour = hourCycle === '12' ? to12Hour(value.hour) : value.hour
  const displayAmPm = getAmPm(value.hour)

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  const setValue = useCallback(
    (next: TimeValue) => {
      setValueRaw(next)
    },
    [setValueRaw],
  )

  const setField = useCallback(
    (field: TimeField, fieldValue: number) => {
      const next = { ...value }
      switch (field) {
        case 'hour':
          next.hour = fieldValue
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
      setValueRaw(next)
    },
    [value, setValueRaw],
  )

  const increment = useCallback(
    (field: TimeField, delta = 1) => {
      const next = incrementField(value, field, delta, { hourCycle, minuteStep, secondStep, minTime, maxTime })
      setValueRaw(next)
    },
    [value, setValueRaw, hourCycle, minuteStep, secondStep, minTime, maxTime],
  )

  const decrement = useCallback(
    (field: TimeField, delta = 1) => {
      const next = incrementField(value, field, -delta, { hourCycle, minuteStep, secondStep, minTime, maxTime })
      setValueRaw(next)
    },
    [value, setValueRaw, hourCycle, minuteStep, secondStep, minTime, maxTime],
  )

  const toggleAmPm = useCallback(() => {
    const currentAmPm = getAmPm(value.hour)
    const hour12 = to12Hour(value.hour)
    const newAmPm = currentAmPm === 'AM' ? 'PM' : 'AM'
    const next = { ...value, hour: to24Hour(hour12, newAmPm) }
    setValueRaw(next)
  }, [value, setValueRaw])

  const focusField = useCallback((field: TimeField) => {
    setFocusedField(field)
  }, [])

  // -------------------------------------------------------------------------
  // Digit input commit helper
  // -------------------------------------------------------------------------

  const commitBuffer = useCallback(
    (field: TimeField, buffer: string) => {
      const parsed = parseTimeInput(buffer, field, hourCycle)
      if (parsed !== null) {
        setField(field, parsed)
      }
      inputBuffer.current = ''
      // Move to next field
      const next = nextField(field, showSeconds, hourCycle)
      if (next) setFocusedField(next)
    },
    [hourCycle, showSeconds, setField],
  )

  // -------------------------------------------------------------------------
  // getFieldProps
  // -------------------------------------------------------------------------

  const getFieldProps = useCallback(
    (field: TimeField): TimeFieldProps => {
      const range = getFieldRange(field, hourCycle)
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
    [value, focusedField, hourCycle, increment, decrement, toggleAmPm, commitBuffer, displayAmPm],
  )

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------

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
