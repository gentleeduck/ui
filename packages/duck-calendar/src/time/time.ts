import type { Time } from './time.types'

/** Convert a TimeValue to total seconds for comparison. */
function toSeconds(t: Time.ITimeValue): number {
  return t.hour * 3600 + t.minute * 60 + (t.second ?? 0)
}

/** Check if a time value has valid ranges. */
export function isValidTime(time: Time.ITimeValue): boolean {
  if (time.hour < 0 || time.hour > 23) return false
  if (time.minute < 0 || time.minute > 59) return false
  if (time.second !== undefined && (time.second < 0 || time.second > 59)) return false
  return true
}

/** Clamp a time value within min/max bounds. */
export function clampTime(time: Time.ITimeValue, min?: Time.ITimeValue, max?: Time.ITimeValue): Time.ITimeValue {
  // When min > max, the constraints are contradictory - return time unchanged
  if (min && max && toSeconds(min) > toSeconds(max)) return { ...time }

  const hasSeconds = time.second !== undefined
  let result = { ...time }

  // Normalize bounds to same precision as input for accurate comparison
  const normalizeForCompare = (t: Time.ITimeValue): Time.ITimeValue => (hasSeconds ? t : { hour: t.hour, minute: t.minute })

  if (min && toSeconds(normalizeForCompare(result)) < toSeconds(normalizeForCompare(min))) {
    result = { ...min }
  }
  if (max && toSeconds(normalizeForCompare(result)) > toSeconds(normalizeForCompare(max))) {
    result = { ...max }
  }
  // Preserve the second field only if the original had it
  if (!hasSeconds) {
    const { second: _, ...rest } = result
    return rest
  }
  return result
}

/** Increment or decrement a specific field, wrapping at boundaries. */
export function incrementField(
  time: Time.ITimeValue,
  field: Time.TimeField,
  delta: number,
  config: Pick<Time.ITimePickerConfig, 'hourCycle' | 'minuteStep' | 'secondStep' | 'minTime' | 'maxTime'> = {},
): Time.ITimeValue {
  const step = field === 'minute' ? (config.minuteStep ?? 1) : field === 'second' ? (config.secondStep ?? 1) : 1
  const actualDelta = delta * step
  const result = { ...time }

  switch (field) {
    case 'hour': {
      result.hour = (((result.hour + actualDelta) % 24) + 24) % 24
      break
    }
    case 'minute': {
      result.minute = (((result.minute + actualDelta) % 60) + 60) % 60
      break
    }
    case 'second': {
      result.second = ((((result.second ?? 0) + actualDelta) % 60) + 60) % 60
      break
    }
    case 'ampm': {
      // Toggle AM/PM by adding/subtracting 12 hours
      result.hour = (result.hour + 12) % 24
      break
    }
  }

  return clampTime(result, config.minTime, config.maxTime)
}

/** Parse a digit string typed by the user into a valid field value. Returns null if invalid. */
export function parseTimeInput(input: string, field: Time.TimeField, hourCycle: Time.HourCycle): number | null {
  const num = Number.parseInt(input, 10)
  if (Number.isNaN(num)) return null

  switch (field) {
    case 'hour': {
      const max = hourCycle === '12' ? 12 : 23
      const min = hourCycle === '12' ? 1 : 0
      if (num < min || num > max) return null
      return hourCycle === '12' ? (num === 12 ? 0 : num) : num
    }
    case 'minute':
      if (num < 0 || num > 59) return null
      return num
    case 'second':
      if (num < 0 || num > 59) return null
      return num
    default:
      return null
  }
}
