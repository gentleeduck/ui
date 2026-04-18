import type { Transition } from 'motion/react'
import * as React from 'react'
import { useMotionConfig } from './motion-provider'

/**
 * Context for tracking open state across MotionRoot and MotionContent pairs.
 * The root keeps the primitive open during exit animations by passing
 * `open={isOpen || showContent}` to the primitive root.
 */
export interface IMotionRootContextValue {
  /** Whether the user intends the component to be open. */
  isOpen: boolean
  /** Whether the content is still visually mounted (including during exit animation). */
  showContent: boolean
  /** Called by AnimatePresence onExitComplete to finally unmount. */
  setShowContent: (v: boolean) => void
}

export const MotionRootContext = React.createContext<IMotionRootContextValue>({
  isOpen: false,
  showContent: false,
  setShowContent: () => {},
})

/**
 * Hook that manages the two-state pattern for motion exit animations.
 *
 * Returns props to spread on the primitive Root (`rootProps`) and a context
 * value to provide via `MotionRootContext.Provider`.
 *
 * The primitive Root receives `open={isOpen || showContent}` so it stays
 * open during the exit animation. When `AnimatePresence` calls
 * `onExitComplete`, `showContent` goes false, which finally closes the Root.
 *
 * @example
 * ```tsx
 * function MotionDialog({ children, open, onOpenChange, ...rest }) {
 *   const { rootProps, contextValue } = useMotionRoot({ open, onOpenChange })
 *   return (
 *     <MotionRootContext.Provider value={contextValue}>
 *       <DialogPrimitive.Root {...rootProps} {...rest}>
 *         {children}
 *       </DialogPrimitive.Root>
 *     </MotionRootContext.Provider>
 *   )
 * }
 * ```
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
  // When re-opening (e.g. dropdown trigger toggle during exit animation),
  // DismissableLayer fires a close on the same pointerdown event. This ref
  // tells handleOpenChange to ignore that immediate close.
  const ignoreNextCloseRef = React.useRef(false)

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next) {
        // Opening: ensure showContent is true so content mounts immediately.
        // This handles re-opening during an exit animation.
        setShowContent(true)
        // Ignore the DismissableLayer close that fires on the same event frame.
        // Dropdown/popover triggers use pointerdown to toggle, and the still-mounted
        // DismissableLayer catches the same pointerdown as an "outside click".
        ignoreNextCloseRef.current = true
        requestAnimationFrame(() => {
          ignoreNextCloseRef.current = false
        })
      } else {
        if (ignoreNextCloseRef.current) {
          // This close is from DismissableLayer on the same event as the open - skip it.
          ignoreNextCloseRef.current = false
          return
        }
        // Closing: immediately restore body pointer events.
        // DismissableLayer sets body.style.pointerEvents='none' while mounted,
        // and with forceMount it stays mounted during exit animation.
        // Without this, the trigger is unclickable until exit completes.
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

/**
 * Hook to read the motion root context from a content component.
 * Returns `isOpen` and `setShowContent` for driving AnimatePresence.
 */
export function useMotionContent() {
  return React.useContext(MotionRootContext)
}

/**
 * Derives exit duration in milliseconds from a Transition config.
 * Checks `duration` and `visualDuration` (spring) fields.
 */
export function getTransitionDurationMs(t?: Transition): number {
  if (!t) return 180
  if ('duration' in t && typeof t.duration === 'number') return t.duration * 1000
  if ('visualDuration' in t && typeof t.visualDuration === 'number') return t.visualDuration * 1000
  return 180
}

/**
 * Hook that manually drives mount/unmount for motion content components that
 * live inside a primitive Portal + Slot boundary.
 *
 * AnimatePresence can't reliably track exit animations through
 * `<Portal forceMount><Content asChild>...` because its direct child is a
 * non-motion wrapper. This hook gives you a deterministic `shouldRender`
 * boolean that:
 *   1. Becomes `true` immediately when `isOpen` flips to true
 *   2. Stays `true` for `exitDurationMs` after `isOpen` flips to false so the
 *      motion.div can animate its exit in place
 *   3. Becomes `false` after the delay so the component fully unmounts
 *
 * Also restores `document.body.style.pointerEvents` on close so DismissableLayer
 * + RemoveScroll stickiness never blocks clicks on the underlying page.
 *
 * @example
 * ```tsx
 * const { isOpen } = useMotionContent()
 * const shouldRender = useMotionMount(isOpen)
 * if (!shouldRender) return null
 * return (
 *   <Portal forceMount>
 *     <Content forceMount asChild>
 *       <m.div
 *         initial={content.initial}
 *         animate={isOpen ? content.animate : content.exit}
 *         transition={content.transition}
 *       />
 *     </Content>
 *   </Portal>
 * )
 * ```
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
    // Closing: force body pointer events back on immediately so clicks on the
    // surface underneath register without waiting for the exit animation.
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
