import { renderHook } from '@testing-library/react'
import { NativeAdapter } from '../../../adapter'
import { useKeyboard } from '../use-keyboard'
import type { KeyboardConfig } from '../use-keyboard.types'

describe('useKeyboard', () => {
  let adapter: NativeAdapter
  let onFocusChange: ReturnType<typeof vi.fn>
  let onSelect: ReturnType<typeof vi.fn>
  let onDismiss: ReturnType<typeof vi.fn>

  // March 15 2026 is a Sunday
  const baseDate = new Date(2026, 2, 15)

  function makeConfig(overrides?: Partial<KeyboardConfig<Date>>): KeyboardConfig<Date> {
    return {
      focusedDate: baseDate,
      onFocusChange,
      onSelect,
      onDismiss,
      isDisabled: () => false,
      adapter,
      weekStartDay: 0,
      ...overrides,
    }
  }

  /** Creates a fake React keyboard event and invokes the hook's onKeyDown handler. */
  function pressKey(config: KeyboardConfig<Date>, key: string, options?: { shiftKey?: boolean }) {
    const { result } = renderHook(() => useKeyboard(config))

    let wasDefaultPrevented = false
    const fakeEvent = {
      key,
      shiftKey: options?.shiftKey ?? false,
      preventDefault: () => {
        wasDefaultPrevented = true
      },
    } as unknown as React.KeyboardEvent

    result.current.onKeyDown(fakeEvent)

    return { defaultPrevented: wasDefaultPrevented }
  }

  beforeEach(() => {
    adapter = new NativeAdapter()
    onFocusChange = vi.fn()
    onSelect = vi.fn()
    onDismiss = vi.fn()
  })

  // ---------------------------------------------------------------------------
  // Arrow key navigation
  // ---------------------------------------------------------------------------
  describe('arrow keys', () => {
    it('ArrowLeft moves focus -1 day', () => {
      pressKey(makeConfig(), 'ArrowLeft')
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(2)
      expect(result.getDate()).toBe(14)
    })

    it('ArrowRight moves focus +1 day', () => {
      pressKey(makeConfig(), 'ArrowRight')
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDate()).toBe(16)
    })

    it('ArrowUp moves focus -7 days (previous week)', () => {
      pressKey(makeConfig(), 'ArrowUp')
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDate()).toBe(8)
      expect(result.getMonth()).toBe(2)
    })

    it('ArrowDown moves focus +7 days (next week)', () => {
      pressKey(makeConfig(), 'ArrowDown')
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDate()).toBe(22)
      expect(result.getMonth()).toBe(2)
    })
  })

  // ---------------------------------------------------------------------------
  // Page navigation
  // ---------------------------------------------------------------------------
  describe('page keys', () => {
    it('PageUp moves focus -1 month', () => {
      pressKey(makeConfig(), 'PageUp')
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getMonth()).toBe(1) // February
      expect(result.getDate()).toBe(15)
      expect(result.getFullYear()).toBe(2026)
    })

    it('PageDown moves focus +1 month', () => {
      pressKey(makeConfig(), 'PageDown')
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getMonth()).toBe(3) // April
      expect(result.getDate()).toBe(15)
    })

    it('Shift+PageUp moves focus -1 year', () => {
      pressKey(makeConfig(), 'PageUp', { shiftKey: true })
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(2)
      expect(result.getDate()).toBe(15)
    })

    it('Shift+PageDown moves focus +1 year', () => {
      pressKey(makeConfig(), 'PageDown', { shiftKey: true })
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getFullYear()).toBe(2027)
      expect(result.getMonth()).toBe(2)
      expect(result.getDate()).toBe(15)
    })
  })

  // ---------------------------------------------------------------------------
  // Home / End
  // ---------------------------------------------------------------------------
  describe('Home and End', () => {
    it('Home moves to start of week (weekStartDay=0, Sunday)', () => {
      // March 15 2026 is already Sunday (start of week), so Home returns March 15
      pressKey(makeConfig({ weekStartDay: 0 }), 'Home')
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDay()).toBe(0) // Sunday
      expect(result.getDate()).toBe(15)
    })

    it('Home moves to start of week (weekStartDay=1, Monday)', () => {
      // March 15 2026 is Sunday. With weekStartDay=1 (Monday), start of week is March 9
      pressKey(makeConfig({ weekStartDay: 1 }), 'Home')
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDay()).toBe(1) // Monday
      expect(result.getDate()).toBe(9)
    })

    it('End moves to end of week (weekStartDay=0)', () => {
      // weekStartDay=0 (Sunday). Week: Sun Mar 15 - Sat Mar 21. End = Mar 21
      pressKey(makeConfig({ weekStartDay: 0 }), 'End')
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDay()).toBe(6) // Saturday
      expect(result.getDate()).toBe(21)
    })

    it('End moves to end of week (weekStartDay=1)', () => {
      // weekStartDay=1 (Monday). Week: Mon Mar 9 - Sun Mar 15. End = Mar 15 (Sunday)
      pressKey(makeConfig({ weekStartDay: 1 }), 'End')
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDay()).toBe(0) // Sunday
      expect(result.getDate()).toBe(15)
    })
  })

  // ---------------------------------------------------------------------------
  // Selection: Enter / Space
  // ---------------------------------------------------------------------------
  describe('selection', () => {
    it('Enter triggers onSelect with focused date', () => {
      pressKey(makeConfig(), 'Enter')
      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(onSelect).toHaveBeenCalledWith(baseDate, { shiftKey: false })
    })

    it('Space triggers onSelect with focused date', () => {
      pressKey(makeConfig(), ' ')
      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(onSelect).toHaveBeenCalledWith(baseDate, { shiftKey: false })
    })

    it('Enter on disabled date does NOT trigger onSelect', () => {
      pressKey(
        makeConfig({
          isDisabled: (d) => d.getDate() === 15,
        }),
        'Enter',
      )
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('Space on disabled date does NOT trigger onSelect', () => {
      pressKey(
        makeConfig({
          isDisabled: (d) => d.getDate() === 15,
        }),
        ' ',
      )
      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  // ---------------------------------------------------------------------------
  // Dismiss: Escape
  // ---------------------------------------------------------------------------
  describe('dismiss', () => {
    it('Escape triggers onDismiss', () => {
      pressKey(makeConfig(), 'Escape')
      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('Escape does not crash when onDismiss is undefined', () => {
      expect(() => {
        pressKey(makeConfig({ onDismiss: undefined }), 'Escape')
      }).not.toThrow()
    })
  })

  // ---------------------------------------------------------------------------
  // Disabled date skipping
  // ---------------------------------------------------------------------------
  describe('disabled date skipping', () => {
    it('ArrowLeft skips disabled date and lands on next enabled date', () => {
      // March 14 is disabled, so ArrowLeft from March 15 should skip 14 and land on 13
      pressKey(
        makeConfig({
          isDisabled: (d) => d.getDate() === 14,
        }),
        'ArrowLeft',
      )
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDate()).toBe(13)
    })

    it('ArrowRight skips disabled date', () => {
      // March 16 is disabled, so ArrowRight from March 15 should skip 16 and land on 17
      pressKey(
        makeConfig({
          isDisabled: (d) => d.getDate() === 16,
        }),
        'ArrowRight',
      )
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDate()).toBe(17)
    })

    it('ArrowUp skips disabled date a week back', () => {
      // March 8 is disabled, so ArrowUp from March 15 should skip 8 and land on March 1
      pressKey(
        makeConfig({
          isDisabled: (d) => d.getDate() === 8,
        }),
        'ArrowUp',
      )
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDate()).toBe(1)
      expect(result.getMonth()).toBe(2)
    })

    it('Home skips disabled start-of-week and finds next enabled day', () => {
      // March 15 (Sunday) is start of week with weekStartDay=0.
      // If March 15 is disabled, Home should find March 16
      pressKey(
        makeConfig({
          weekStartDay: 0,
          isDisabled: (d) => d.getDate() === 15,
        }),
        'Home',
      )
      expect(onFocusChange).toHaveBeenCalledTimes(1)
      const result: Date = onFocusChange.mock.calls[0][0]
      expect(result.getDate()).toBe(16)
    })
  })

  // ---------------------------------------------------------------------------
  // Unknown keys
  // ---------------------------------------------------------------------------
  describe('unknown keys', () => {
    it('pressing "a" does nothing  -  no callbacks called', () => {
      pressKey(makeConfig(), 'a')
      expect(onFocusChange).not.toHaveBeenCalled()
      expect(onSelect).not.toHaveBeenCalled()
      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('pressing "Tab" does nothing', () => {
      pressKey(makeConfig(), 'Tab')
      expect(onFocusChange).not.toHaveBeenCalled()
      expect(onSelect).not.toHaveBeenCalled()
      expect(onDismiss).not.toHaveBeenCalled()
    })
  })

  // ---------------------------------------------------------------------------
  // preventDefault
  // ---------------------------------------------------------------------------
  describe('preventDefault', () => {
    it('ArrowLeft calls preventDefault', () => {
      const { defaultPrevented } = pressKey(makeConfig(), 'ArrowLeft')
      expect(defaultPrevented).toBe(true)
    })

    it('ArrowRight calls preventDefault', () => {
      const { defaultPrevented } = pressKey(makeConfig(), 'ArrowRight')
      expect(defaultPrevented).toBe(true)
    })

    it('Enter calls preventDefault', () => {
      const { defaultPrevented } = pressKey(makeConfig(), 'Enter')
      expect(defaultPrevented).toBe(true)
    })

    it('Space calls preventDefault', () => {
      const { defaultPrevented } = pressKey(makeConfig(), ' ')
      expect(defaultPrevented).toBe(true)
    })

    it('Escape calls preventDefault', () => {
      const { defaultPrevented } = pressKey(makeConfig(), 'Escape')
      expect(defaultPrevented).toBe(true)
    })

    it('PageUp calls preventDefault', () => {
      const { defaultPrevented } = pressKey(makeConfig(), 'PageUp')
      expect(defaultPrevented).toBe(true)
    })

    it('unknown key does NOT call preventDefault', () => {
      const { defaultPrevented } = pressKey(makeConfig(), 'a')
      expect(defaultPrevented).toBe(false)
    })
  })

  // ---------------------------------------------------------------------------
  // Hook return shape
  // ---------------------------------------------------------------------------
  describe('hook return', () => {
    it('returns an object with onKeyDown function', () => {
      const { result } = renderHook(() => useKeyboard(makeConfig()))
      expect(typeof result.current.onKeyDown).toBe('function')
    })
  })
})
