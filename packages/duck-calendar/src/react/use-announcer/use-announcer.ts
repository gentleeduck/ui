import { createElement, useCallback, useEffect, useRef, useState } from 'react'
import type { IAnnouncerReturn } from './use-announcer.types'

const DEBOUNCE_MS = 150

const HIDDEN_STYLE: React.CSSProperties = {
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

function LiveRegion({ messageRef }: { messageRef: React.RefObject<string> }) {
  const [text, setText] = useState('')

  // Sync ref → state on every render (ref.current can't be a dep)
  useEffect(() => {
    if (messageRef.current !== text) {
      setText(messageRef.current)
    }
  })

  return createElement(
    'div',
    { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true', 'aria-relevant': 'text', style: HIDDEN_STYLE },
    text,
  )
}

export function useAnnouncer(): IAnnouncerReturn {
  const [, forceRender] = useState(0)
  const messageRef = useRef('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const announce = useCallback((next: string) => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)

    messageRef.current = ''
    forceRender((n) => n + 1)

    timerRef.current = setTimeout(() => {
      timerRef.current = null
      messageRef.current = next
      forceRender((n) => n + 1)
    }, DEBOUNCE_MS)
  }, [])

  const AnnouncerPortal: React.FC = useCallback(() => createElement(LiveRegion, { messageRef }), [])

  return { announce, AnnouncerPortal }
}

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
