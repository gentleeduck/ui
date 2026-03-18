import { useCallback, useEffect, useRef, useState } from 'react'
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

/** Stable component that renders an inline aria-live region. */
function LiveRegion({ messageRef }: { messageRef: React.RefObject<string> }) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (messageRef.current !== text) {
      setText(messageRef.current)
    }
  })

  return (
    <div role="status" aria-live="polite" aria-atomic="true" aria-relevant="text" style={hiddenStyles}>
      {text}
    </div>
  )
}

export function useAnnouncer(): AnnouncerReturn {
  const [, forceRender] = useState(0)
  const messageRef = useRef('')
  const outerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const innerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
      messageRef.current = ''
      forceRender((n) => n + 1)
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

export function buildMonthNavigationMessage(month: string, year: string): string {
  return `${month} ${year}`
}

export function buildDateSelectedMessage(date: string): string {
  return `${date} selected`
}

export function buildRangeSelectedMessage(from: string, to: string): string {
  return `Range: ${from} to ${to}`
}

export function buildDateDisabledMessage(date: string): string {
  return `${date} is unavailable`
}
