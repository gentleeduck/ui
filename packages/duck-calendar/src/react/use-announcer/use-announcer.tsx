import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { AnnouncerReturn } from './use-announcer.types'

const DEBOUNCE_MS = 150

/** Visually hidden but accessible to screen readers. */
const hiddenStyles: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
}

export function useAnnouncer(): AnnouncerReturn {
  const [message, setMessage] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear the timer on unmount so we don't set state on an unmounted component
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const announce = useCallback((next: string) => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      // Toggling through empty string forces screen readers to re-announce
      // the same message if it hasn't changed (e.g. navigating to a boundary)
      setMessage('')
      // A second tick ensures the DOM update with '' is committed first
      timerRef.current = setTimeout(() => {
        setMessage(next)
        timerRef.current = null
      }, 0)
    }, DEBOUNCE_MS)
  }, [])

  const AnnouncerPortal: React.FC = useCallback(() => {
    if (typeof document === 'undefined') return null

    return createPortal(
      <div role="status" aria-live="polite" aria-atomic="true" aria-relevant="text" style={hiddenStyles}>
        {message}
      </div>,
      document.body,
    )
  }, [message])

  return { announce, AnnouncerPortal }
}

// ---------------------------------------------------------------------------
// Announcement message builders
// ---------------------------------------------------------------------------

/**
 * "March 2026"
 */
export function buildMonthNavigationMessage(month: string, year: string): string {
  return `${month} ${year}`
}

/**
 * "March 14 selected"
 */
export function buildDateSelectedMessage(date: string): string {
  return `${date} selected`
}

/**
 * "Range: March 14 to March 20"
 */
export function buildRangeSelectedMessage(from: string, to: string): string {
  return `Range: ${from} to ${to}`
}

/**
 * "March 14 is unavailable"
 */
export function buildDateDisabledMessage(date: string): string {
  return `${date} is unavailable`
}
