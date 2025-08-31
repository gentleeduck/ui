import {
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
  flip,
  offset,
  Placement,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react'
import * as React from 'react'
import { cleanLockScrollbar, lockScrollbar } from '../dialog'
import { Mount } from '../mount'

interface PopoverOptions {
  initialOpen?: boolean
  placement?: Placement
  modal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  sideOffset?: number
  alignOffset?: number
  matchWidth?: boolean
  enableHover?: boolean
  mainAxis?: boolean
}

export function usePopover({
  initialOpen = false,
  placement = 'bottom',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  sideOffset = 4,
  alignOffset = 0,
  matchWidth = false,
  enableHover = false,
  mainAxis = true,
}: PopoverOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const middleware = [
    offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
    flip({
      crossAxis: placement.includes('-'),
      mainAxis,
      fallbackAxisSideDirection: 'end',
      padding: 5,
    }),
    shift({ padding: 5 }),
  ]

  if (matchWidth) {
    middleware.push(
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          })
        },
      }),
    )
  }

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware,
  })

  const context = data.context

  const click = useClick(context, {
    enabled: controlledOpen == null,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const hover = useHover(context, {
    move: true,
    restMs: 200,
    enabled: enableHover,
    delay: { open: 150, close: 150 },
  })

  const interactions = useInteractions([click, dismiss, role, hover])

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
    }),
    [open, setOpen, interactions, data, modal],
  )
}

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
