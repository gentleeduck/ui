import React, { useEffect, useMemo, useRef } from 'react'
import { assignStyle, chain, isVertical } from './src/helpers'
import { BORDER_RADIUS, TRANSITIONS, WINDOW_TOP_OFFSET } from './src/constants'

const noop = () => () => { }

export function useScaleBackground({
  open,
  direction,
  shouldScaleBackground,
  setBackgroundColorOnScale,
  noBodyStyles,
}: {
  open: boolean
  direction: 'top' | 'bottom' | 'left' | 'right'
  shouldScaleBackground: boolean
  setBackgroundColorOnScale: boolean
  noBodyStyles: boolean
}) {
  const timeoutIdRef = useRef<number | null>(null)

  const initialBg = useMemo(() => document.body.style.backgroundColor, [])

  const scale = (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth

  useEffect(() => {
    if (!(open && shouldScaleBackground)) return

    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)

    const wrapper =
      (document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement) ??
      (document.querySelector('[vaul-drawer-wrapper]') as HTMLElement)

    if (!wrapper) return

    const isVert = isVertical(direction)
    const offset = `calc(env(safe-area-inset-top) + 14px)`

    const cleanup = chain(
      setBackgroundColorOnScale && !noBodyStyles
        ? assignStyle(document.body, { background: 'black' })
        : noop,
      assignStyle(wrapper, {
        transformOrigin: isVert ? 'top' : 'left',
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')}), border-radius ${TRANSITIONS.DURATION}s`,
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: 'hidden',
        transform: `scale(${scale}) translate3d(${isVert ? '0, ' + offset : offset + ', 0'}, 0)`,
      }),
    )

    return () => {
      cleanup()
      timeoutIdRef.current = window.setTimeout(() => {
        if (initialBg) {
          document.body.style.background = initialBg
        } else {
          document.body.style.removeProperty('background')
        }
      }, TRANSITIONS.DURATION * 1000)
    }
  }, [
    open,
    shouldScaleBackground,
    direction,
    setBackgroundColorOnScale,
    noBodyStyles,
    initialBg,
  ])
}
