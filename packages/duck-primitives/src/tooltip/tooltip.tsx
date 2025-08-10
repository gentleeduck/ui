import type { Placement } from '@floating-ui/react'
import {
  autoUpdate,
  FloatingPortal,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  safePolygon,
} from '@floating-ui/react'
import * as React from 'react'
import { Mount } from '../mount'

interface TooltipOptions {
  initialOpen?: boolean
  placement?: Placement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  skipDelayDuration?: number
  delayDuration?: number
}

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  delayDuration = 700,
  skipDelayDuration = 150,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  })

  const context = data.context

  const hover = useHover(context, {
    move: false,
    restMs: skipDelayDuration,
    enabled: controlledOpen == null,
    delay: { open: delayDuration, close: delayDuration },
  })

  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  })
  const dismiss = useDismiss(context, {
    outsidePress: false,
  })
  const role = useRole(context, { role: 'tooltip' })

  const interactions = useInteractions([hover, focus, dismiss, role])

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data],
  )
}

type ContextType = ReturnType<typeof useTooltip> | null

const TooltipContext = React.createContext<ContextType>(null)

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext)

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />')
  }

  return context
}

function Root({ children, ...options }: { children: React.ReactNode } & TooltipOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options)
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>
}

const Trigger = ({
  children,
  asChild = false,
  ref: propRef,
  ...props
}: React.HTMLProps<HTMLButtonElement> & { asChild?: boolean }) => {
  const context = useTooltipContext()
  const childrenRef = (children as any).ref
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...(children.props as any),
        'data-open': context.open,
      }),
    )
  }

  return (
    <button
      ref={ref}
      // The user can style the trigger based on the state
      data-open={context.open}
      {...context.getReferenceProps(props)}>
      {children}
    </button>
  )
}

function Content({ style, ref: propRef, ...props }: React.HTMLProps<HTMLDivElement>) {
  const context = useTooltipContext()
  const localRef = React.useRef<HTMLDivElement | null>(null)
  const mergedRef = useMergeRefs([context.refs.setFloating, propRef as any, localRef])
  const readyRef = React.useRef(false)

  // Apply animation imperatively when ready
  const applyReadyStyles = React.useCallback(() => {
    if (!localRef.current) return
    readyRef.current = true
    localRef.current.style.transform = `${context.floatingStyles?.transform ?? ''} scale(1)`
    localRef.current.style.opacity = '1'
  }, [context.floatingStyles])

  // Reset styles on close (imperatively)
  React.useEffect(() => {
    if (!context.open) {
      readyRef.current = false
      if (localRef.current) {
        localRef.current.style.transform = `${context.floatingStyles?.transform ?? ''} scale(0.95)`
        localRef.current.style.opacity = '0'
      }
    }
  }, [context.open, context.floatingStyles])

  return (
    <FloatingPortal>
      <div
        ref={mergedRef}
        data-open={context.open}
        {...context.getFloatingProps(props)}
        style={
          {
            ...(context.floatingStyles || {}),
            transform: `${context.floatingStyles?.transform ?? ''} scale(0.95)`,
            opacity: 0,
            '--duck-tooltip-transform-origin': context.floatingStyles?.transformOrigin,
            transformOrigin: 'var(--duck-tooltip-transform-origin)',
            ...style,
          } as React.CSSProperties
        }>
        <Mount open={context.open} ref={localRef} waitForRender onReady={applyReadyStyles}>
          {props.children}
        </Mount>
      </div>
    </FloatingPortal>
  )
}

export { Root, Trigger, Content }
