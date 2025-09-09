'use client'

import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useMergeRefs } from '@floating-ui/react'
import * as React from 'react'
import { cleanLockScrollbar, lockScrollbar } from '../dialog'
import { Mount } from '../mount'
import { Slot } from '../slot'
import { useSheet, useSheetContext } from './sheet.hooks'
import { SheetContextProps, SheetOptions } from './sheet.types'

const SheetContext = React.createContext<SheetContextProps>(null)

function Root({
  children,
  ...options
}: {
  children: React.ReactNode
} & SheetOptions) {
  const Sheet = useSheet(options)
  return <SheetContext.Provider value={Sheet}>{children}</SheetContext.Provider>
}

function Trigger({
  children,
  asChild = false,
  ref: propRef,
  onClick,
  ...props
}: React.ComponentPropsWithRef<typeof Slot> & {
  asChild?: boolean
}) {
  const context = useSheetContext()
  const childrenRef = (children as any)?.ref
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])
  const Comp = asChild ? Slot : 'button'

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
    <Comp
      ref={ref}
      // The user can style the trigger based on the state
      data-open={context.open}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        context.setOpen(!context.open)
        onClick?.(e)
      }}
      {...context.getReferenceProps(props)}>
      {children}
    </Comp>
  )
}

function Content({
  style,
  ref: propRef,
  renderOnce = false,
  forceMount = false,
  side = 'right',
  SheetClose: SheetClose,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  renderOnce?: boolean
  forceMount?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
  SheetClose?: React.FC
}) {
  const { context: floatingContext, ...context } = useSheetContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])

  return (
    <FloatingFocusManager context={floatingContext}>
      <div
        ref={ref}
        data-open={context.open}
        data-side={side}
        {...context.getFloatingProps(props)}
        style={{
          ...style,
        }}>
        {
          <Mount open={context.open} renderOnce={renderOnce} {...props}>
            {props.children}
            {context.closeButton && <SheetClose />}
          </Mount>
        }
      </div>
    </FloatingFocusManager>
  )
}

function Overlay({ children, lockScroll = true, ...props }: React.ComponentPropsWithRef<typeof FloatingOverlay>) {
  const { ...context } = useSheetContext()

  React.useEffect(() => {
    if (lockScroll && context.open) {
      lockScrollbar(true)
    }
    return () => cleanLockScrollbar()
  }, [lockScroll, context.open])

  return (
    <FloatingOverlay
      data-open={context.open}
      style={
        {
          pointerEvents: context.open ? 'auto' : 'none',
          opacity: context.open ? 1 : 0,
          zIndex: 45,
          '--duck-sheet-overlay-bg': 'oklch(0.12 0 0 / 0.83)',
          backdropFilter: 'blur(1px)',
          background: 'var(--duck-sheet-overlay-bg)',
          overflow: 'hidden',
        } as React.CSSProperties
      }
      {...props}>
      {children}
    </FloatingOverlay>
  )
}

function Heading({ children, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  const { setLabelId } = useSheetContext()
  const id = React.useId()

  // Only sets `aria-labelledby` on the Sheet root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setLabelId(id)
    return () => setLabelId(undefined)
  }, [id, setLabelId])

  return (
    <div {...props} ref={ref} id={id}>
      {children}
    </div>
  )
}

function Title({ children, ref, ...props }: React.HTMLProps<HTMLHeadingElement>) {
  const { setTitleId } = useSheetContext()
  const id = React.useId()

  // Only sets `aria-describedby` on the Sheet root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setTitleId(id)
    return () => setTitleId(undefined)
  }, [id, setTitleId])

  return (
    <h2 {...props} ref={ref} id={id}>
      {children}
    </h2>
  )
}

function Description({ children, ref, ...props }: React.HTMLProps<HTMLParagraphElement>) {
  const { setDescriptionId } = useSheetContext()
  const id = React.useId()

  // Only sets `aria-describedby` on the Sheet root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setDescriptionId(id)
    return () => setDescriptionId(undefined)
  }, [id, setDescriptionId])

  return (
    <p {...props} ref={ref} id={id}>
      {children}
    </p>
  )
}

function Close(props: React.ComponentPropsWithRef<typeof Slot>) {
  const { setOpen } = useSheetContext()
  return <Slot {...props} ref={props?.ref} onClick={() => setOpen(false)} />
}

function Portal({ children, ...props }: React.ComponentPropsWithRef<typeof FloatingPortal>) {
  return <FloatingPortal {...props}>{children}</FloatingPortal>
}

export { Root, Trigger, Content, Heading, Title, Description, Close, Portal, SheetContext, Overlay }
