import { act, renderHook } from '@testing-library/react'
import { NativeAdapter } from '../../../adapter'
import { useDateTime } from '../use-datetime'

const adapter = new NativeAdapter()
const march15_1430 = new Date(2026, 2, 15, 14, 30, 0)

describe('useDateTime', () => {
  // ---------------------------------------------------------------------------
  // Initial value
  // ---------------------------------------------------------------------------
  describe('initial value', () => {
    it('extracts date and time from defaultValue', () => {
      const { result } = renderHook(() =>
        useDateTime({
          adapter,
          defaultValue: march15_1430,
        }),
      )

      expect(result.current.state.value).not.toBeNull()
      const val = result.current.state.value!
      expect(val.getFullYear()).toBe(2026)
      expect(val.getMonth()).toBe(2)
      expect(val.getDate()).toBe(15)
      expect(val.getHours()).toBe(14)
      expect(val.getMinutes()).toBe(30)
      expect(val.getSeconds()).toBe(0)
    })

    it('value is null when no defaultValue provided', () => {
      const { result } = renderHook(() => useDateTime({ adapter }))

      expect(result.current.state.value).toBeNull()
    })
  })

  // ---------------------------------------------------------------------------
  // Selecting a date preserves the time
  // ---------------------------------------------------------------------------
  describe('date selection preserves time', () => {
    it('selecting a new date keeps the existing time', () => {
      const { result } = renderHook(() =>
        useDateTime({
          adapter,
          defaultValue: march15_1430,
          defaultMonth: new Date(2026, 2, 1),
        }),
      )

      const march20 = new Date(2026, 2, 20)
      act(() => {
        result.current.calendar.actions.selectDate(march20)
      })

      const val = result.current.state.value!
      expect(val.getDate()).toBe(20)
      expect(val.getHours()).toBe(14)
      expect(val.getMinutes()).toBe(30)
      expect(val.getSeconds()).toBe(0)
    })
  })

  // ---------------------------------------------------------------------------
  // Changing time preserves the date
  // ---------------------------------------------------------------------------
  describe('time change preserves date', () => {
    it('changing time keeps the existing date', () => {
      const { result } = renderHook(() =>
        useDateTime({
          adapter,
          defaultValue: march15_1430,
        }),
      )

      act(() => {
        result.current.timePicker.actions.setValue({ hour: 9, minute: 15, second: 45 })
      })

      const val = result.current.state.value!
      expect(val.getFullYear()).toBe(2026)
      expect(val.getMonth()).toBe(2)
      expect(val.getDate()).toBe(15)
      expect(val.getHours()).toBe(9)
      expect(val.getMinutes()).toBe(15)
      expect(val.getSeconds()).toBe(45)
    })
  })

  // ---------------------------------------------------------------------------
  // Controlled value follows prop
  // ---------------------------------------------------------------------------
  describe('controlled value', () => {
    it('follows the controlled value prop', () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useDateTime({
            adapter,
            value,
          }),
        { initialProps: { value: march15_1430 } },
      )

      expect(result.current.state.value!.getHours()).toBe(14)

      const newValue = new Date(2026, 5, 10, 8, 0, 0)
      rerender({ value: newValue })

      expect(result.current.state.value!.getMonth()).toBe(5)
      expect(result.current.state.value!.getDate()).toBe(10)
      expect(result.current.state.value!.getHours()).toBe(8)
    })
  })

  // ---------------------------------------------------------------------------
  // onChange fires with combined datetime
  // ---------------------------------------------------------------------------
  describe('onChange', () => {
    it('fires with combined datetime when date is selected', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useDateTime({
          adapter,
          defaultValue: march15_1430,
          defaultMonth: new Date(2026, 2, 1),
          onChange,
        }),
      )

      const march22 = new Date(2026, 2, 22)
      act(() => {
        result.current.calendar.actions.selectDate(march22)
      })

      expect(onChange).toHaveBeenCalledOnce()
      const received = onChange.mock.calls[0][0] as Date
      expect(received.getDate()).toBe(22)
      expect(received.getHours()).toBe(14)
      expect(received.getMinutes()).toBe(30)
    })

    it('fires with combined datetime when time changes', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useDateTime({
          adapter,
          defaultValue: march15_1430,
          onChange,
        }),
      )

      act(() => {
        result.current.timePicker.actions.setValue({ hour: 18, minute: 0, second: 0 })
      })

      expect(onChange).toHaveBeenCalled()
      const received = onChange.mock.calls[0][0] as Date
      expect(received.getDate()).toBe(15)
      expect(received.getHours()).toBe(18)
      expect(received.getMinutes()).toBe(0)
    })
  })

  // ---------------------------------------------------------------------------
  // Sub-returns are accessible
  // ---------------------------------------------------------------------------
  describe('sub-returns', () => {
    it('calendar sub-return is accessible with expected shape', () => {
      const { result } = renderHook(() =>
        useDateTime({
          adapter,
          defaultValue: march15_1430,
          defaultMonth: new Date(2026, 2, 1),
        }),
      )

      expect(result.current.calendar.state).toBeDefined()
      expect(result.current.calendar.actions).toBeDefined()
      expect(typeof result.current.calendar.getDayProps).toBe('function')
      expect(typeof result.current.calendar.getGridProps).toBe('function')
      expect(typeof result.current.calendar.getNavProps).toBe('function')
      expect(typeof result.current.calendar.getHeaderProps).toBe('function')
    })

    it('timePicker sub-return is accessible with expected shape', () => {
      const { result } = renderHook(() =>
        useDateTime({
          adapter,
          defaultValue: march15_1430,
        }),
      )

      expect(result.current.timePicker.state).toBeDefined()
      expect(result.current.timePicker.actions).toBeDefined()
      expect(typeof result.current.timePicker.getFieldProps).toBe('function')
      expect(result.current.timePicker.state.value).toBeDefined()
      expect(typeof result.current.timePicker.state.value.hour).toBe('number')
      expect(typeof result.current.timePicker.state.value.minute).toBe('number')
    })
  })
})
