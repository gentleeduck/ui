import { FloatingFocusManager, FloatingPortal, useMergeRefs } from '@floating-ui/react'
import * as React from 'react'
import { cleanLockScrollbar, lockScrollbar } from '../dialog'
import { Mount } from '../mount'
import { usePopover } from './popover.hooks'
import { PopoverOptions } from './popover.types'

const PopoverContext = React.createContext<ReturnType<typeof usePopover> | null>(null)

export function usePopoverContext() {
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
}: React.HTMLProps<HTMLElement> & {
  asChild?: boolean
}) {
  const context = usePopoverContext()
  const childrenRef = (children as any)?.ref
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
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          onClick?.(e)
          context.setOpen(!context.open)
        },
      }),
    )
  }

  return (
    <button
      ref={ref}
      type="button"
      // The user can style the trigger based on the state
      data-open={context.open}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        onClick?.(e)
        context.setOpen(!context.open)
      }}
      {...context.getReferenceProps(props)}>
      {children}
    </button>
  )
}

function Content({
  style,
  ref: propRef,
  forceMount = true,
  renderOnce = false,
  waitForRender = true,
  withPortal = true,
  lockScroll = false,
  ...props
}: React.HTMLProps<HTMLDivElement> &
  React.ComponentPropsWithoutRef<typeof Mount> & {
    withPortal?: boolean
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

  const Children = (
    <FloatingFocusManager context={floatingContext} modal={context.modal}>
      <div
        ref={ref}
        style={{
          ...{
            ...context.floatingStyles,
            transform: `${context.floatingStyles.transform} scale(${context.open ? 1 : 0.9})`,
          },
          ...style,
        }}
        data-open={context.open}
        {...context.getFloatingProps(props)}>
        <Mount
          open={context.open}
          ref={ref as never}
          forceMount={forceMount}
          waitForRender={waitForRender}
          renderOnce={renderOnce}
          {...props}>
          {props.children}
        </Mount>
      </div>
    </FloatingFocusManager>
  )
  return withPortal ? <Portal>{Children}</Portal> : Children
}

function Portal({ children, ...props }: React.ComponentPropsWithRef<typeof FloatingPortal>) {
  return <FloatingPortal {...props}>{children}</FloatingPortal>
}

export { Root, Trigger, Content, Portal }
