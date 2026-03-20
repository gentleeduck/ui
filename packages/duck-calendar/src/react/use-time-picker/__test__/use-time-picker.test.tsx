import { act, renderHook } from '@testing-library/react'
import { useTimePicker } from '../use-time-picker'

describe('useTimePicker', () => {
  // ---------------------------------------------------------------------------
  // Default value
  // ---------------------------------------------------------------------------
  it('default value is { hour: 0, minute: 0 }', () => {
    const { result } = renderHook(() => useTimePicker())

    expect(result.current.state.value).toEqual({ hour: 0, minute: 0 })
  })

  // ---------------------------------------------------------------------------
  // Controlled value
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Increment / Decrement
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // AM/PM toggle
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // 12-hour display
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // getFieldProps
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Focus field
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // setField
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // onChange callback
  // ---------------------------------------------------------------------------
  it('onChange is called when value changes', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useTimePicker({ defaultValue: { hour: 0, minute: 0 }, onChange }))

    act(() => {
      result.current.actions.increment('hour')
    })

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith({ hour: 1, minute: 0 })
  })
})
