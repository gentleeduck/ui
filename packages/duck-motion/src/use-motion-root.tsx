import type { Transition } from 'motion/react'
import * as React from 'react'
import { useMotionConfig } from './motion-provider'

/**
 * Bridges MotionRoot and MotionContent so the primitive stays "open" while
 * the content's exit animation is still playing. Root passes
 * `open={isOpen || showContent}` to the primitive.
 */
export interface IMotionRootContextValue {
  isOpen: boolean
  /** Content still visually mounted (including during exit). */
  showContent: boolean
  /** Called by `AnimatePresence.onExitComplete` to finally unmount. */
  setShowContent: (v: boolean) => void
}

export const MotionRootContext = React.createContext<IMotionRootContextValue>({
  isOpen: false,
  showContent: false,
  setShowContent: () => {},
})

/**
 * Two-state pattern for motion exit animations. Returns `rootProps` to spread
 * on the primitive Root and a `contextValue` to provide via
 * `MotionRootContext.Provider`. The primitive stays open during exit because
 * Root receives `open={isOpen || showContent}`; `AnimatePresence.onExitComplete`
 * flips `showContent` false to finally close.
 */
export function useMotionRoot(props: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { open: controlledOpen, defaultOpen = false, onOpenChange } = props

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const [showContent, setShowContent] = React.useState(!!isOpen)
  const prevOpenRef = React.useRef(!!isOpen)
  // Re-opening during an exit: DismissableLayer treats the trigger's
  // pointerdown as an outside-click and fires a close on the same frame.
  // Swallow that one close.
  const ignoreNextCloseRef = React.useRef(false)

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next) {
        setShowContent(true)
        ignoreNextCloseRef.current = true
        requestAnimationFrame(() => {
          ignoreNextCloseRef.current = false
        })
      } else {
        if (ignoreNextCloseRef.current) {
          ignoreNextCloseRef.current = false
          return
        }
        // DismissableLayer sets body pointer-events:none while mounted; with
        // forceMount it stays mounted through exit, so restore immediately
        // or the trigger is unclickable until the animation completes.
        document.body.style.pointerEvents = ''
      }
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) setShowContent(true)
    prevOpenRef.current = !!isOpen
  }, [isOpen])

  const contextValue = React.useMemo<IMotionRootContextValue>(
    () => ({ isOpen: !!isOpen, showContent, setShowContent }),
    [isOpen, showContent],
  )

  const rootProps = React.useMemo(
    () => ({ open: !!isOpen, onOpenChange: handleOpenChange }),
    [isOpen, handleOpenChange],
  )

  return { rootProps, contextValue }
}

/** Read MotionRoot context from a content component. */
export function useMotionContent() {
  return React.useContext(MotionRootContext)
}

/** Exit duration (ms) from a `Transition`. Reads `duration` or spring `visualDuration`. */
export function getTransitionDurationMs(t?: Transition): number {
  if (!t) return 180
  if ('duration' in t && typeof t.duration === 'number') return t.duration * 1000
  if ('visualDuration' in t && typeof t.visualDuration === 'number') return t.visualDuration * 1000
  return 180
}

/**
 * Manual mount/unmount driver for content inside a `<Portal forceMount><Content asChild>`
 * boundary, where `AnimatePresence` can't track exits through the non-motion
 * wrapper. `shouldRender` flips true immediately on open and stays true for
 * `exitDurationMs` after close so the exit animation plays in place, then unmounts.
 *
 * Also restores `document.body.style.pointerEvents` on close — DismissableLayer +
 * RemoveScroll otherwise stick `none` on the body and block the underlying page.
 */
export function useMotionMount(isOpen: boolean, exitDurationMs?: number): boolean {
  const { exitTransition } = useMotionConfig()
  const resolvedDuration = exitDurationMs ?? getTransitionDurationMs(exitTransition)
  const [shouldRender, setShouldRender] = React.useState(isOpen)

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      return
    }
    if (typeof document !== 'undefined' && document.body.style.pointerEvents === 'none') {
      document.body.style.pointerEvents = ''
    }
    const t = setTimeout(() => {
      setShouldRender(false)
      if (typeof document !== 'undefined' && document.body.style.pointerEvents === 'none') {
        document.body.style.pointerEvents = ''
      }
    }, resolvedDuration)
    return () => clearTimeout(t)
  }, [isOpen, resolvedDuration])

  return shouldRender
}
