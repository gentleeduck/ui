import * as React from 'react'

/**
 * Context for tracking open state across MotionRoot and MotionContent pairs.
 * The root keeps the primitive open during exit animations by passing
 * `open={isOpen || showContent}` to the primitive root.
 */
export interface MotionRootContextValue {
  /** Whether the user intends the component to be open. */
  isOpen: boolean
  /** Whether the content is still visually mounted (including during exit animation). */
  showContent: boolean
  /** Called by AnimatePresence onExitComplete to finally unmount. */
  setShowContent: (v: boolean) => void
}

export const MotionRootContext = React.createContext<MotionRootContextValue>({
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

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) setShowContent(true)
    prevOpenRef.current = !!isOpen
  }, [isOpen])

  const contextValue = React.useMemo<MotionRootContextValue>(
    () => ({ isOpen: !!isOpen, showContent, setShowContent }),
    [isOpen, showContent],
  )

  const rootProps = React.useMemo(
    () => ({ open: isOpen || showContent, onOpenChange: handleOpenChange }),
    [isOpen, showContent, handleOpenChange],
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
