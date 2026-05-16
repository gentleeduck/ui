import { act, renderHook } from '@testing-library/react'
import { useTimePicker } from '../use-time-picker'

describe('useTimePicker', () => {
  it('default value is { hour: 0, minute: 0 }', () => {
    const { result } = renderHook(() => useTimePicker())

    expect(result.current.state.value).toEqual({ hour: 0, minute: 0 })
  })

  it('controlled value follows prop', () => {
    const controlled = { hour: 14, minute: 30 }
    const { result } = renderHook(() => useTimePicker({ value: controlled }))

    expect(result.current.state.value).toEqual({ hour: 14, minute: 30 })
  })

  it('controlled value updates when prop changes', () => {
    let value = { hour: 14, minute: 30 }
    const { result, rerender } = renderHook(() => useTimePicker({ value }))

    expect(result.current.state.value.hour).toBe(14)

    value = { hour: 9, minute: 15 }
    rerender()

    expect(result.current.state.value).toEqual({ hour: 9, minute: 15 })
  })

  it('increment("hour") advances by 1', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 10, minute: 0 } }))

    act(() => {
      result.current.actions.increment('hour')
    })

    expect(result.current.state.value.hour).toBe(11)
  })

  it('decrement("minute") decreases by 1', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 30 } }))

    act(() => {
      result.current.actions.decrement('minute')
    })

    expect(result.current.state.value.minute).toBe(29)
  })

  it('hour wraps: 23 + 1 = 0', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 23, minute: 0 } }))

    act(() => {
      result.current.actions.increment('hour')
    })

    expect(result.current.state.value.hour).toBe(0)
  })

  it('minute wraps: 0 - 1 = 59', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 0 } }))

    act(() => {
      result.current.actions.decrement('minute')
    })

    expect(result.current.state.value.minute).toBe(59)
  })

  it('toggleAmPm flips AM to PM', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 9, minute: 0 }, hourCycle: '12' }))

    expect(result.current.state.displayAmPm).toBe('AM')

    act(() => {
      result.current.actions.toggleAmPm()
    })

    expect(result.current.state.displayAmPm).toBe('PM')
    expect(result.current.state.value.hour).toBe(21)
  })

  it('toggleAmPm flips PM to AM', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 21, minute: 0 }, hourCycle: '12' }))

    expect(result.current.state.displayAmPm).toBe('PM')

    act(() => {
      result.current.actions.toggleAmPm()
    })

    expect(result.current.state.displayAmPm).toBe('AM')
    expect(result.current.state.value.hour).toBe(9)
  })

  it('12h display: hour 0 shows 12', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 0 }, hourCycle: '12' }))

    expect(result.current.state.displayHour).toBe(12)
    expect(result.current.state.displayAmPm).toBe('AM')
  })

  it('12h display: hour 13 shows 1', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 13, minute: 0 }, hourCycle: '12' }))

    expect(result.current.state.displayHour).toBe(1)
    expect(result.current.state.displayAmPm).toBe('PM')
  })

  it('24h display: hour 13 shows 13', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 13, minute: 0 }, hourCycle: '24' }))

    expect(result.current.state.displayHour).toBe(13)
  })

  describe('getFieldProps', () => {
    it('hour returns correct ARIA attrs', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 14, minute: 30 }, hourCycle: '24' }))

      const props = result.current.getFieldProps('hour')

      expect(props.role).toBe('spinbutton')
      expect(props['aria-label']).toBe('Hour')
      expect(props['aria-valuemin']).toBe(0)
      expect(props['aria-valuemax']).toBe(23)
      expect(props['aria-valuenow']).toBe(14)
      expect(props['aria-valuetext']).toBe('14')
      expect(props['data-slot']).toBe('time-picker-field')
    })

    it('hour in 12h mode returns correct range', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 14, minute: 30 }, hourCycle: '12' }))

      const props = result.current.getFieldProps('hour')

      expect(props['aria-valuemin']).toBe(1)
      expect(props['aria-valuemax']).toBe(12)
      expect(props['aria-valuenow']).toBe(2)
      expect(props['aria-valuetext']).toBe('02')
    })

    it('minute returns correct ARIA attrs', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 45 } }))

      const props = result.current.getFieldProps('minute')

      expect(props['aria-label']).toBe('Minute')
      expect(props['aria-valuemin']).toBe(0)
      expect(props['aria-valuemax']).toBe(59)
      expect(props['aria-valuenow']).toBe(45)
      expect(props['aria-valuetext']).toBe('45')
    })

    it('ampm returns correct ARIA attrs', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 14, minute: 0 }, hourCycle: '12' }))

      const props = result.current.getFieldProps('ampm')

      expect(props['aria-label']).toBe('AM/PM')
      expect(props['aria-valuemin']).toBe(0)
      expect(props['aria-valuemax']).toBe(1)
      expect(props['aria-valuenow']).toBe(1) // PM
      expect(props['aria-valuetext']).toBe('PM')
    })
  })

  it('focusField changes which field has tabIndex=0', () => {
    const { result } = renderHook(() => useTimePicker())

    // Default focus is on hour
    expect(result.current.getFieldProps('hour').tabIndex).toBe(0)
    expect(result.current.getFieldProps('minute').tabIndex).toBe(-1)

    act(() => {
      result.current.actions.focusField('minute')
    })

    expect(result.current.getFieldProps('hour').tabIndex).toBe(-1)
    expect(result.current.getFieldProps('minute').tabIndex).toBe(0)
  })

  it('focusField sets data-focused', () => {
    const { result } = renderHook(() => useTimePicker())

    expect(result.current.getFieldProps('hour')['data-focused']).toBe('true')
    expect(result.current.getFieldProps('minute')['data-focused']).toBeUndefined()

    act(() => {
      result.current.actions.focusField('minute')
    })

    expect(result.current.getFieldProps('hour')['data-focused']).toBeUndefined()
    expect(result.current.getFieldProps('minute')['data-focused']).toBe('true')
  })

  it('setField updates the specific field', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 0 } }))

    act(() => {
      result.current.actions.setField('hour', 15)
    })

    expect(result.current.state.value.hour).toBe(15)
    expect(result.current.state.value.minute).toBe(0)
  })

  it('setField("minute") updates only minute', () => {
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 10, minute: 0 } }))

    act(() => {
      result.current.actions.setField('minute', 45)
    })

    expect(result.current.state.value.hour).toBe(10)
    expect(result.current.state.value.minute).toBe(45)
  })

  it('onChange is called when value changes', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 0 }, onChange }))

    act(() => {
      result.current.actions.increment('hour')
    })

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith({ hour: 1, minute: 0 })
  })

  describe('12h mode edge cases', () => {
    it('12h display: hour 12 (noon) shows 12 PM', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 12, minute: 0 }, hourCycle: '12' }))

      expect(result.current.state.displayHour).toBe(12)
      expect(result.current.state.displayAmPm).toBe('PM')
    })

    it('12h display: hour 23 shows 11 PM', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 23, minute: 59 }, hourCycle: '12' }))

      expect(result.current.state.displayHour).toBe(11)
      expect(result.current.state.displayAmPm).toBe('PM')
    })

    it('12h display: hour 11 shows 11 AM', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 11, minute: 0 }, hourCycle: '12' }))

      expect(result.current.state.displayHour).toBe(11)
      expect(result.current.state.displayAmPm).toBe('AM')
    })

    it('toggleAmPm at midnight (0) flips to noon (12)', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 0 }, hourCycle: '12' }))

      expect(result.current.state.displayAmPm).toBe('AM')
      expect(result.current.state.displayHour).toBe(12)

      act(() => {
        result.current.actions.toggleAmPm()
      })

      expect(result.current.state.displayAmPm).toBe('PM')
      expect(result.current.state.value.hour).toBe(12)
    })

    it('toggleAmPm at noon (12) flips to midnight (0)', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 12, minute: 0 }, hourCycle: '12' }))

      expect(result.current.state.displayAmPm).toBe('PM')

      act(() => {
        result.current.actions.toggleAmPm()
      })

      expect(result.current.state.displayAmPm).toBe('AM')
      expect(result.current.state.value.hour).toBe(0)
    })

    it('increment hour in 12h mode wraps from 12 PM to 1 PM', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 12, minute: 0 }, hourCycle: '12' }))

      act(() => {
        result.current.actions.increment('hour')
      })

      expect(result.current.state.value.hour).toBe(13)
      expect(result.current.state.displayHour).toBe(1)
      expect(result.current.state.displayAmPm).toBe('PM')
    })

    it('decrement hour in 12h mode wraps from 1 AM to 12 AM (midnight)', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 1, minute: 0 }, hourCycle: '12' }))

      act(() => {
        result.current.actions.decrement('hour')
      })

      expect(result.current.state.value.hour).toBe(0)
      expect(result.current.state.displayHour).toBe(12)
      expect(result.current.state.displayAmPm).toBe('AM')
    })
  })

  describe('24h mode edge cases', () => {
    it('24h display: hour 0 shows 0', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 0 }, hourCycle: '24' }))

      expect(result.current.state.displayHour).toBe(0)
    })

    it('hour wraps: 0 - 1 = 23', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 0 } }))

      act(() => {
        result.current.actions.decrement('hour')
      })

      expect(result.current.state.value.hour).toBe(23)
    })

    it('minute wraps: 59 + 1 = 0', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 59 } }))

      act(() => {
        result.current.actions.increment('minute')
      })

      expect(result.current.state.value.minute).toBe(0)
    })
  })

  describe('min/max time boundaries', () => {
    it('increment is clamped at maxTime', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 17, minute: 0 },
          maxTime: { hour: 17, minute: 30 },
        }),
      )

      // Increment minute 31 times past the max
      for (let i = 0; i < 31; i++) {
        act(() => {
          result.current.actions.increment('minute')
        })
      }

      // Should be clamped to maxTime
      expect(result.current.state.value.minute).toBeLessThanOrEqual(30)
    })

    it('decrement is clamped at minTime', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 9, minute: 0 },
          minTime: { hour: 9, minute: 0 },
        }),
      )

      act(() => {
        result.current.actions.decrement('minute')
      })

      // Should be clamped to minTime
      expect(result.current.state.value.hour).toBeGreaterThanOrEqual(9)
      expect(result.current.state.value.minute).toBeGreaterThanOrEqual(0)
    })

    it('setField is clamped to minTime', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 10, minute: 30 },
          minTime: { hour: 9, minute: 0 },
        }),
      )

      act(() => {
        result.current.actions.setField('hour', 5)
      })

      expect(result.current.state.value.hour).toBeGreaterThanOrEqual(9)
    })

    it('setField is clamped to maxTime', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 10, minute: 0 },
          maxTime: { hour: 17, minute: 0 },
        }),
      )

      act(() => {
        result.current.actions.setField('hour', 20)
      })

      expect(result.current.state.value.hour).toBeLessThanOrEqual(17)
    })

    it('toggleAmPm is clamped by minTime/maxTime', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 14, minute: 0 },
          hourCycle: '12',
          minTime: { hour: 12, minute: 0 },
          maxTime: { hour: 23, minute: 59 },
        }),
      )

      expect(result.current.state.displayAmPm).toBe('PM')

      act(() => {
        result.current.actions.toggleAmPm()
      })

      // Should be clamped back to PM since minTime is 12:00
      expect(result.current.state.value.hour).toBeGreaterThanOrEqual(12)
    })
  })

  describe('seconds field', () => {
    it('showSeconds getFieldProps returns second field', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 10, minute: 30, second: 45 },
          showSeconds: true,
        }),
      )

      const props = result.current.getFieldProps('second')

      expect(props.role).toBe('spinbutton')
      expect(props['aria-label']).toBe('Second')
      expect(props['aria-valuemin']).toBe(0)
      expect(props['aria-valuemax']).toBe(59)
      expect(props['aria-valuenow']).toBe(45)
      expect(props['aria-valuetext']).toBe('45')
    })

    it('increment second wraps: 59 + 1 = 0', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 10, minute: 0, second: 59 },
          showSeconds: true,
        }),
      )

      act(() => {
        result.current.actions.increment('second')
      })

      expect(result.current.state.value.second).toBe(0)
    })

    it('decrement second wraps: 0 - 1 = 59', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 10, minute: 0, second: 0 },
          showSeconds: true,
        }),
      )

      act(() => {
        result.current.actions.decrement('second')
      })

      expect(result.current.state.value.second).toBe(59)
    })

    it('setField("second") updates only second', () => {
      const { result } = renderHook(() =>
        useTimePicker({ defaultValue: { hour: 10, minute: 30, second: 0 }, showSeconds: true }),
      )

      act(() => {
        result.current.actions.setField('second', 42)
      })

      expect(result.current.state.value.hour).toBe(10)
      expect(result.current.state.value.minute).toBe(30)
      expect(result.current.state.value.second).toBe(42)
    })
  })

  describe('step increments', () => {
    it('minuteStep=5 increments by 5', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 10, minute: 0 },
          minuteStep: 5,
        }),
      )

      act(() => {
        result.current.actions.increment('minute')
      })

      expect(result.current.state.value.minute).toBe(5)
    })

    it('minuteStep=15 increments by 15', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 10, minute: 0 },
          minuteStep: 15,
        }),
      )

      act(() => {
        result.current.actions.increment('minute')
      })

      expect(result.current.state.value.minute).toBe(15)
    })

    it('minuteStep=5 decrements by 5', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 10, minute: 30 },
          minuteStep: 5,
        }),
      )

      act(() => {
        result.current.actions.decrement('minute')
      })

      expect(result.current.state.value.minute).toBe(25)
    })

    it('secondStep=10 increments by 10', () => {
      const { result } = renderHook(() =>
        useTimePicker({
          defaultValue: { hour: 10, minute: 0, second: 0 },
          showSeconds: true,
          secondStep: 10,
        }),
      )

      act(() => {
        result.current.actions.increment('second')
      })

      expect(result.current.state.value.second).toBe(10)
    })
  })

  describe('setValue', () => {
    it('setValue replaces the entire time value', () => {
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 0 } }))

      act(() => {
        result.current.actions.setValue({ hour: 15, minute: 45 })
      })

      expect(result.current.state.value).toEqual({ hour: 15, minute: 45 })
    })

    it('setValue with seconds', () => {
      const { result } = renderHook(() =>
        useTimePicker({ defaultValue: { hour: 0, minute: 0, second: 0 }, showSeconds: true }),
      )

      act(() => {
        result.current.actions.setValue({ hour: 8, minute: 30, second: 15 })
      })

      expect(result.current.state.value).toEqual({ hour: 8, minute: 30, second: 15 })
    })
  })

  describe('onChange callback edge cases', () => {
    it('onChange fires on toggleAmPm', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useTimePicker({ defaultValue: { hour: 9, minute: 0 }, hourCycle: '12', onChange }),
      )

      act(() => {
        result.current.actions.toggleAmPm()
      })

      expect(onChange).toHaveBeenCalledOnce()
      expect(onChange.mock.calls[0]![0].hour).toBe(21)
    })

    it('onChange fires on setField', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 10, minute: 0 }, onChange }))

      act(() => {
        result.current.actions.setField('minute', 30)
      })

      expect(onChange).toHaveBeenCalledOnce()
      expect(onChange.mock.calls[0]![0]).toEqual({ hour: 10, minute: 30 })
    })

    it('onChange fires on decrement', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 10, minute: 30 }, onChange }))

      act(() => {
        result.current.actions.decrement('minute')
      })

      expect(onChange).toHaveBeenCalledOnce()
      expect(onChange.mock.calls[0]![0].minute).toBe(29)
    })
  })

  describe('hourCycle state', () => {
    it('state.hourCycle reflects the configured hourCycle', () => {
      const { result } = renderHook(() => useTimePicker({ hourCycle: '12' }))
      expect(result.current.state.hourCycle).toBe('12')
    })

    it('state.hourCycle defaults to 24', () => {
      const { result } = renderHook(() => useTimePicker())
      expect(result.current.state.hourCycle).toBe('24')
    })
  })
})
