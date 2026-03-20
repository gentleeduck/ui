import { describe, expect, it } from 'vitest'
import { clampTime, incrementField, isValidTime, parseTimeInput } from '../time'
import { formatTimeField, getAmPm, to12Hour, to24Hour } from '../time.libs'

describe('time', () => {
  // ---------------------------------------------------------------------------
  // isValidTime
  // ---------------------------------------------------------------------------
  describe('isValidTime', () => {
    it('valid: { hour: 0, minute: 0 }', () => {
      expect(isValidTime({ hour: 0, minute: 0 })).toBe(true)
    })

    it('valid: { hour: 23, minute: 59, second: 59 }', () => {
      expect(isValidTime({ hour: 23, minute: 59, second: 59 })).toBe(true)
    })

    it('valid: { hour: 12, minute: 30 }', () => {
      expect(isValidTime({ hour: 12, minute: 30 })).toBe(true)
    })

    it('valid: { hour: 0, minute: 0, second: 0 }', () => {
      expect(isValidTime({ hour: 0, minute: 0, second: 0 })).toBe(true)
    })

    it('invalid: hour < 0', () => {
      expect(isValidTime({ hour: -1, minute: 0 })).toBe(false)
    })

    it('invalid: hour > 23', () => {
      expect(isValidTime({ hour: 24, minute: 0 })).toBe(false)
    })

    it('invalid: minute < 0', () => {
      expect(isValidTime({ hour: 0, minute: -1 })).toBe(false)
    })

    it('invalid: minute > 59', () => {
      expect(isValidTime({ hour: 0, minute: 60 })).toBe(false)
    })

    it('invalid: second < 0', () => {
      expect(isValidTime({ hour: 0, minute: 0, second: -1 })).toBe(false)
    })

    it('invalid: second > 59', () => {
      expect(isValidTime({ hour: 0, minute: 0, second: 60 })).toBe(false)
    })

    it('valid when second is undefined', () => {
      expect(isValidTime({ hour: 10, minute: 30 })).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // clampTime
  // ---------------------------------------------------------------------------
  describe('clampTime', () => {
    it('within bounds returns no change', () => {
      const time = { hour: 10, minute: 30 }
      const min = { hour: 8, minute: 0 }
      const max = { hour: 18, minute: 0 }
      expect(clampTime(time, min, max)).toEqual({ hour: 10, minute: 30 })
    })

    it('below min clamps to min', () => {
      const time = { hour: 6, minute: 0 }
      const min = { hour: 8, minute: 0 }
      expect(clampTime(time, min)).toEqual({ hour: 8, minute: 0 })
    })

    it('above max clamps to max', () => {
      const time = { hour: 20, minute: 0 }
      const max = { hour: 18, minute: 0 }
      expect(clampTime(time, undefined, max)).toEqual({ hour: 18, minute: 0 })
    })

    it('no min/max returns no change', () => {
      const time = { hour: 14, minute: 45 }
      expect(clampTime(time)).toEqual({ hour: 14, minute: 45 })
    })

    it('preserves second field presence when original has it', () => {
      const time = { hour: 10, minute: 30, second: 15 }
      const result = clampTime(time)
      expect(result).toEqual({ hour: 10, minute: 30, second: 15 })
      expect('second' in result).toBe(true)
    })

    it('strips second field when original lacks it', () => {
      const time = { hour: 6, minute: 0 }
      const min = { hour: 8, minute: 0, second: 30 }
      const result = clampTime(time, min)
      expect(result).toEqual({ hour: 8, minute: 0 })
      expect('second' in result).toBe(false)
    })

    it('clamps using total seconds comparison (minute precision)', () => {
      const time = { hour: 8, minute: 0 }
      const min = { hour: 8, minute: 15 }
      expect(clampTime(time, min)).toEqual({ hour: 8, minute: 15 })
    })

    it('exact min boundary is not clamped', () => {
      const time = { hour: 8, minute: 0 }
      const min = { hour: 8, minute: 0 }
      expect(clampTime(time, min)).toEqual({ hour: 8, minute: 0 })
    })

    it('exact max boundary is not clamped', () => {
      const time = { hour: 18, minute: 0 }
      const max = { hour: 18, minute: 0 }
      expect(clampTime(time, undefined, max)).toEqual({ hour: 18, minute: 0 })
    })
  })

  // ---------------------------------------------------------------------------
  // incrementField
  // ---------------------------------------------------------------------------
  describe('incrementField', () => {
    it('hour: increments normally', () => {
      const result = incrementField({ hour: 10, minute: 0 }, 'hour', 1)
      expect(result.hour).toBe(11)
    })

    it('hour: wraps 23+1 to 0', () => {
      const result = incrementField({ hour: 23, minute: 0 }, 'hour', 1)
      expect(result.hour).toBe(0)
    })

    it('hour: wraps 0-1 to 23', () => {
      const result = incrementField({ hour: 0, minute: 0 }, 'hour', -1)
      expect(result.hour).toBe(23)
    })

    it('minute: increments normally', () => {
      const result = incrementField({ hour: 10, minute: 30 }, 'minute', 1)
      expect(result.minute).toBe(31)
    })

    it('minute: wraps 59+1 to 0', () => {
      const result = incrementField({ hour: 10, minute: 59 }, 'minute', 1)
      expect(result.minute).toBe(0)
    })

    it('minute: wraps 0-1 to 59', () => {
      const result = incrementField({ hour: 10, minute: 0 }, 'minute', -1)
      expect(result.minute).toBe(59)
    })

    it('second: increments normally', () => {
      const result = incrementField({ hour: 10, minute: 0, second: 30 }, 'second', 1)
      expect(result.second).toBe(31)
    })

    it('second: wraps 59+1 to 0', () => {
      const result = incrementField({ hour: 10, minute: 0, second: 59 }, 'second', 1)
      expect(result.second).toBe(0)
    })

    it('second: wraps 0-1 to 59', () => {
      const result = incrementField({ hour: 10, minute: 0, second: 0 }, 'second', -1)
      expect(result.second).toBe(59)
    })

    it('ampm: toggles AM to PM (0 -> 12)', () => {
      const result = incrementField({ hour: 0, minute: 0 }, 'ampm', 1)
      expect(result.hour).toBe(12)
    })

    it('ampm: toggles PM to AM (13 -> 1)', () => {
      const result = incrementField({ hour: 13, minute: 0 }, 'ampm', 1)
      expect(result.hour).toBe(1)
    })

    it('ampm: toggles PM to AM (12 -> 0)', () => {
      const result = incrementField({ hour: 12, minute: 0 }, 'ampm', 1)
      expect(result.hour).toBe(0)
    })

    it('ampm: toggles AM to PM (11 -> 23)', () => {
      const result = incrementField({ hour: 11, minute: 0 }, 'ampm', 1)
      expect(result.hour).toBe(23)
    })

    it('minuteStep: increment by 5 when step=5', () => {
      const result = incrementField({ hour: 10, minute: 0 }, 'minute', 1, { minuteStep: 5 })
      expect(result.minute).toBe(5)
    })

    it('minuteStep: decrement by 5 when step=5', () => {
      const result = incrementField({ hour: 10, minute: 10 }, 'minute', -1, { minuteStep: 5 })
      expect(result.minute).toBe(5)
    })

    it('minuteStep: wraps with step (55+5 -> 0)', () => {
      const result = incrementField({ hour: 10, minute: 55 }, 'minute', 1, { minuteStep: 5 })
      expect(result.minute).toBe(0)
    })

    it('secondStep: increment by 15 when step=15', () => {
      const result = incrementField({ hour: 10, minute: 0, second: 0 }, 'second', 1, { secondStep: 15 })
      expect(result.second).toBe(15)
    })

    it('respects min clamping after increment', () => {
      const result = incrementField({ hour: 8, minute: 0 }, 'hour', -1, {
        minTime: { hour: 8, minute: 0 },
      })
      expect(result.hour).toBe(8)
      expect(result.minute).toBe(0)
    })

    it('respects max clamping after increment', () => {
      const result = incrementField({ hour: 18, minute: 0 }, 'hour', 1, {
        maxTime: { hour: 18, minute: 0 },
      })
      expect(result.hour).toBe(18)
      expect(result.minute).toBe(0)
    })
  })

  // ---------------------------------------------------------------------------
  // parseTimeInput
  // ---------------------------------------------------------------------------
  describe('parseTimeInput', () => {
    it('valid "14" for hour (24h) returns 14', () => {
      expect(parseTimeInput('14', 'hour', '24')).toBe(14)
    })

    it('valid "0" for hour (24h) returns 0', () => {
      expect(parseTimeInput('0', 'hour', '24')).toBe(0)
    })

    it('valid "23" for hour (24h) returns 23', () => {
      expect(parseTimeInput('23', 'hour', '24')).toBe(23)
    })

    it('valid "2" for hour (12h) returns 2', () => {
      expect(parseTimeInput('2', 'hour', '12')).toBe(2)
    })

    it('valid "1" for hour (12h) returns 1', () => {
      expect(parseTimeInput('1', 'hour', '12')).toBe(1)
    })

    it('invalid "25" for hour (24h) returns null', () => {
      expect(parseTimeInput('25', 'hour', '24')).toBeNull()
    })

    it('invalid "-1" for hour (24h) returns null', () => {
      expect(parseTimeInput('-1', 'hour', '24')).toBeNull()
    })

    it('invalid "0" for hour (12h) returns null', () => {
      expect(parseTimeInput('0', 'hour', '12')).toBeNull()
    })

    it('invalid "13" for hour (12h) returns null', () => {
      expect(parseTimeInput('13', 'hour', '12')).toBeNull()
    })

    it('"12" in 12h mode returns 0 (noon/midnight)', () => {
      expect(parseTimeInput('12', 'hour', '12')).toBe(0)
    })

    it('valid "30" for minute returns 30', () => {
      expect(parseTimeInput('30', 'minute', '24')).toBe(30)
    })

    it('valid "0" for minute returns 0', () => {
      expect(parseTimeInput('0', 'minute', '24')).toBe(0)
    })

    it('valid "59" for minute returns 59', () => {
      expect(parseTimeInput('59', 'minute', '24')).toBe(59)
    })

    it('invalid "60" for minute returns null', () => {
      expect(parseTimeInput('60', 'minute', '24')).toBeNull()
    })

    it('valid "45" for second returns 45', () => {
      expect(parseTimeInput('45', 'second', '24')).toBe(45)
    })

    it('invalid "60" for second returns null', () => {
      expect(parseTimeInput('60', 'second', '24')).toBeNull()
    })

    it('invalid "abc" returns null', () => {
      expect(parseTimeInput('abc', 'hour', '24')).toBeNull()
    })

    it('invalid empty string returns null', () => {
      expect(parseTimeInput('', 'hour', '24')).toBeNull()
    })

    it('"ampm" field returns null', () => {
      expect(parseTimeInput('1', 'ampm', '24')).toBeNull()
    })
  })

  // ---------------------------------------------------------------------------
  // formatTimeField
  // ---------------------------------------------------------------------------
  describe('formatTimeField', () => {
    it('0 returns "00"', () => {
      expect(formatTimeField(0)).toBe('00')
    })

    it('5 returns "05"', () => {
      expect(formatTimeField(5)).toBe('05')
    })

    it('9 returns "09"', () => {
      expect(formatTimeField(9)).toBe('09')
    })

    it('14 returns "14"', () => {
      expect(formatTimeField(14)).toBe('14')
    })

    it('59 returns "59"', () => {
      expect(formatTimeField(59)).toBe('59')
    })
  })

  // ---------------------------------------------------------------------------
  // getAmPm
  // ---------------------------------------------------------------------------
  describe('getAmPm', () => {
    it('hour 0 returns AM', () => {
      expect(getAmPm(0)).toBe('AM')
    })

    it('hour 11 returns AM', () => {
      expect(getAmPm(11)).toBe('AM')
    })

    it('hour 12 returns PM', () => {
      expect(getAmPm(12)).toBe('PM')
    })

    it('hour 23 returns PM', () => {
      expect(getAmPm(23)).toBe('PM')
    })

    it('hour 6 returns AM', () => {
      expect(getAmPm(6)).toBe('AM')
    })

    it('hour 18 returns PM', () => {
      expect(getAmPm(18)).toBe('PM')
    })
  })

  // ---------------------------------------------------------------------------
  // to12Hour
  // ---------------------------------------------------------------------------
  describe('to12Hour', () => {
    it('0 returns 12 (midnight)', () => {
      expect(to12Hour(0)).toBe(12)
    })

    it('1 returns 1', () => {
      expect(to12Hour(1)).toBe(1)
    })

    it('11 returns 11', () => {
      expect(to12Hour(11)).toBe(11)
    })

    it('12 returns 12 (noon)', () => {
      expect(to12Hour(12)).toBe(12)
    })

    it('13 returns 1', () => {
      expect(to12Hour(13)).toBe(1)
    })

    it('23 returns 11', () => {
      expect(to12Hour(23)).toBe(11)
    })
  })

  // ---------------------------------------------------------------------------
  // to24Hour
  // ---------------------------------------------------------------------------
  describe('to24Hour', () => {
    it('(12, AM) returns 0 (midnight)', () => {
      expect(to24Hour(12, 'AM')).toBe(0)
    })

    it('(1, AM) returns 1', () => {
      expect(to24Hour(1, 'AM')).toBe(1)
    })

    it('(11, AM) returns 11', () => {
      expect(to24Hour(11, 'AM')).toBe(11)
    })

    it('(12, PM) returns 12 (noon)', () => {
      expect(to24Hour(12, 'PM')).toBe(12)
    })

    it('(1, PM) returns 13', () => {
      expect(to24Hour(1, 'PM')).toBe(13)
    })

    it('(11, PM) returns 23', () => {
      expect(to24Hour(11, 'PM')).toBe(23)
    })
  })
})
