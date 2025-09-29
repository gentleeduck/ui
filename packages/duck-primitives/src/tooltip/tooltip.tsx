import { FloatingFocusManager, FloatingPortal, useMergeRefs } from '@floating-ui/react'
import * as React from 'react'
import { cleanLockScrollbar, lockScrollbar } from '../dialog'
import { Presence } from '../presence'
import { Slot } from '../slot'
import { useTooltip } from './tooltip.hooks'
import type { TooltipOptions } from './tooltip.types'

const TooltipContext = React.createContext<ReturnType<typeof useTooltip> | null>(null)

export function useTooltipContext(): NonNullable<ReturnType<typeof useTooltip>> {
  const context = React.useContext(TooltipContext)

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />')
  }

  return context
}

function Root({
  children,
  ...restOptions
}: {
  children: React.ReactNode
} & TooltipOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const Tooltip = useTooltip({ ...restOptions })
  return <TooltipContext.Provider value={Tooltip}>{children}</TooltipContext.Provider>
}

function Trigger({
  children,
  asChild = false,
  ref: propRef,
  onClick,
  ...props
}: React.HTMLProps<typeof HTMLButtonElement> & {
  asChild?: boolean
}) {
  const context = useTooltipContext()
  const childrenRef = (children as any)?.ref
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-open={context.open}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        context.setOpen(!context.open)
        // biome-ignore lint: false positive
        // @ts-ignore
        onClick?.(e)
      }}
      // The user can style the trigger based on the state
      ref={ref}
      type="button"
      // biome-ignore lint: false positive
      // @ts-ignore
      {...context.getReferenceProps(props)}>
      {children}
    </Comp>
  )
}
function Content({
  style,
  ref: propRef,
  forceMount = true,
  renderOnce = true,
  lockScroll = false,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  forceMount?: boolean
  renderOnce?: boolean
  lockScroll?: boolean
}) {
  const { context: floatingContext, ...context } = useTooltipContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])

  React.useEffect(() => {
    if (lockScroll && context.open) {
      lockScrollbar(true)
    }
    return () => cleanLockScrollbar()
  }, [lockScroll, context.open])

  return (
    <Presence present={forceMount || context.open}>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          data-open={context.open}
          data-side={context.placement.split('-')[0]}
          ref={ref}
          style={{
            ...{
              ...context.floatingStyles,
              '--duck-tooltip-content-transform-origin': context.floatingStyles?.transformOrigin,
              transform: `${context.floatingStyles.transform} scale(${context.open ? 1 : 0.95})`,
              transformOrigin: 'var(--duck-tooltip-content-transform-origin)',
              zIndex: 100,
            },
            ...style,
          }}
          // biome-ignore lint: false positive
          // @ts-ignore
          {...context.getFloatingProps(props)}>
          {props.children}
        </div>
      </FloatingFocusManager>
    </Presence>
  )
}

function Portal({ children, ...props }: React.ComponentPropsWithRef<typeof FloatingPortal>) {
  return <FloatingPortal {...props}>{children}</FloatingPortal>
}

export { Root, Trigger, Content, Portal }
