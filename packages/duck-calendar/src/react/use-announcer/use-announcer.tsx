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

/** Stable component that reads message from a ref to avoid remounting. */
function LiveRegion({ messageRef }: { messageRef: React.RefObject<string> }) {
  const [text, setText] = useState('')

  // Sync from ref — the parent triggers re-renders via forceRender
  useEffect(() => {
    if (messageRef.current !== text) {
      setText(messageRef.current)
    }
  })

  if (typeof document === 'undefined') return null

  return createPortal(
    <div role="status" aria-live="polite" aria-atomic="true" aria-relevant="text" style={hiddenStyles}>
      {text}
    </div>,
    document.body,
  )
}

export function useAnnouncer(): AnnouncerReturn {
  const [, forceRender] = useState(0)
  const messageRef = useRef('')
  const outerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const innerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear both timers on unmount
  useEffect(() => {
    return () => {
      if (outerTimerRef.current !== null) clearTimeout(outerTimerRef.current)
      if (innerTimerRef.current !== null) clearTimeout(innerTimerRef.current)
    }
  }, [])

  const announce = useCallback((next: string) => {
    if (outerTimerRef.current !== null) clearTimeout(outerTimerRef.current)
    if (innerTimerRef.current !== null) clearTimeout(innerTimerRef.current)

    outerTimerRef.current = setTimeout(() => {
      outerTimerRef.current = null
      // Toggling through empty string forces screen readers to re-announce
      // the same message if it hasn't changed (e.g. navigating to a boundary)
      messageRef.current = ''
      forceRender((n) => n + 1)
      // A second tick ensures the DOM update with '' is committed first
      innerTimerRef.current = setTimeout(() => {
        innerTimerRef.current = null
        messageRef.current = next
        forceRender((n) => n + 1)
      }, 0)
    }, DEBOUNCE_MS)
  }, [])

  const AnnouncerPortal: React.FC = useCallback(() => <LiveRegion messageRef={messageRef} />, [])

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
