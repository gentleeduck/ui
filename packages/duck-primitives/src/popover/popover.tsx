import { FloatingFocusManager, FloatingPortal, useMergeRefs } from '@floating-ui/react'
import * as React from 'react'
import { Portal as PPortal } from '../portal'
import { cleanLockScrollbar, lockScrollbar } from '../dialog'
import { Presence } from '../presence'
import { Slot } from '../slot'
import { usePopover } from './popover.hooks'
import type { PopoverOptions } from './popover.types'

const PopoverContext = React.createContext<ReturnType<typeof usePopover> | null>(null)

export function usePopoverContext(): NonNullable<ReturnType<typeof usePopover>> {
  const context = React.useContext(PopoverContext)

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />')
  }

  return context
}

function Root({
  children,
  modal = false,
  ...restOptions
}: {
  children: React.ReactNode
} & PopoverOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, ...restOptions })
  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>
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
  const context = usePopoverContext()
  const childrenRef = (children as any)?.ref
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-open={context.open}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        context.setOpen(!context.open)
        // @ts-expect-error
        onClick?.(e)
      }}
      // The user can style the trigger based on the state
      ref={ref}
      type="button"
      // @ts-expect-error
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
  const { context: floatingContext, ...context } = usePopoverContext()
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
              '--duck-sheet-content-transform-origin': context.floatingStyles?.transformOrigin,
              transform: `${context.floatingStyles.transform} scale(${context.open ? 1 : 0.95})`,
              transformOrigin: 'var(--duck-sheet-content-transform-origin)',
              zIndex: 100,
            },
            ...style,
          }}
          //@ts-ignore
          {...context.getFloatingProps(props)}>
          <>{props.children}</>
        </div>
      </FloatingFocusManager>
    </Presence>
  )
}

function Portal({ children, ...props }: React.ComponentPropsWithRef<typeof FloatingPortal>) {
  return <FloatingPortal>{children}</FloatingPortal>
}

export { Root, Trigger, Content, Portal }
