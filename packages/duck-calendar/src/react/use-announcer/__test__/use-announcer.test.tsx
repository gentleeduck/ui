import { act, render, renderHook, screen } from '@testing-library/react'
import {
  buildDateDisabledMessage,
  buildDateSelectedMessage,
  buildMonthNavigationMessage,
  buildRangeSelectedMessage,
  useAnnouncer,
} from '../use-announcer'

// ---------------------------------------------------------------------------
// Message builder functions
// ---------------------------------------------------------------------------
describe('message builders', () => {
  it('buildMonthNavigationMessage returns "month year"', () => {
    expect(buildMonthNavigationMessage('March', '2026')).toBe('March 2026')
  })

  it('buildDateSelectedMessage returns "date selected"', () => {
    expect(buildDateSelectedMessage('March 14')).toBe('March 14 selected')
  })

  it('buildRangeSelectedMessage returns "Range: from to to"', () => {
    expect(buildRangeSelectedMessage('March 14', 'March 20')).toBe('Range: March 14 to March 20')
  })

  it('buildDateDisabledMessage returns "date is unavailable"', () => {
    expect(buildDateDisabledMessage('March 14')).toBe('March 14 is unavailable')
  })
})

// ---------------------------------------------------------------------------
// useAnnouncer hook
// ---------------------------------------------------------------------------
describe('useAnnouncer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initial state has empty message', () => {
    const { result } = renderHook(() => useAnnouncer())

    // Render the portal so we can inspect it
    render(<result.current.AnnouncerPortal />)

    const status = screen.getByRole('status')
    expect(status.textContent).toBe('')
  })

  it('AnnouncerPortal renders a visually hidden element with correct aria attributes', () => {
    const { result } = renderHook(() => useAnnouncer())

    render(<result.current.AnnouncerPortal />)

    const status = screen.getByRole('status')
    expect(status).toBeDefined()
    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(status.getAttribute('aria-atomic')).toBe('true')
    expect(status.getAttribute('aria-relevant')).toBe('text')
  })

  it('announce() updates the aria-live region text after debounce completes', () => {
    const { result } = renderHook(() => useAnnouncer())

    const Wrapper = () => <result.current.AnnouncerPortal />
    const { rerender } = render(<Wrapper />)

    act(() => {
      result.current.announce('March 2026')
    })

    // Before debounce, message should still be empty
    rerender(<Wrapper />)
    expect(screen.getByRole('status').textContent).toBe('')

    // Advance past the 150ms debounce
    act(() => {
      vi.advanceTimersByTime(150)
    })
    rerender(<Wrapper />)

    // After debounce fires, message is cleared to '' first, then the nested
    // setTimeout(0) sets the actual message
    act(() => {
      vi.advanceTimersByTime(1)
    })
    rerender(<Wrapper />)

    expect(screen.getByRole('status').textContent).toBe('March 2026')
  })

  it('rapid sequential calls are debounced — only the last message appears', () => {
    const { result } = renderHook(() => useAnnouncer())

    const Wrapper = () => <result.current.AnnouncerPortal />
    const { rerender } = render(<Wrapper />)

    act(() => {
      result.current.announce('First message')
    })

    // Partially advance (not enough to trigger)
    act(() => {
      vi.advanceTimersByTime(50)
    })

    act(() => {
      result.current.announce('Second message')
    })

    // Partially advance again
    act(() => {
      vi.advanceTimersByTime(50)
    })

    act(() => {
      result.current.announce('Third message')
    })

    // Now advance past the full debounce from the last call
    act(() => {
      vi.advanceTimersByTime(150)
    })
    rerender(<Wrapper />)

    // Advance through the nested setTimeout(0)
    act(() => {
      vi.advanceTimersByTime(1)
    })
    rerender(<Wrapper />)

    expect(screen.getByRole('status').textContent).toBe('Third message')
  })

  it('cleanup on unmount clears pending timers (no state-update-after-unmount warnings)', () => {
    const { result, unmount } = renderHook(() => useAnnouncer())

    act(() => {
      result.current.announce('Will be cancelled')
    })

    // Unmount before debounce fires
    unmount()

    // Advancing timers should not cause warnings or errors
    act(() => {
      vi.advanceTimersByTime(150)
    })
    act(() => {
      vi.advanceTimersByTime(1)
    })
  })
})
