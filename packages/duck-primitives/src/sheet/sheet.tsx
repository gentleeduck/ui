'use client'

import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useMergeRefs } from '@floating-ui/react'
import * as React from 'react'
import { cleanLockScrollbar, lockScrollbar } from '../dialog'
import { Mount } from '../mount'
import { Slot } from '../slot'
import { useSheet, useSheetContext } from './sheet.hooks'
import type { SheetContextProps, SheetOptions } from './sheet.types'

const SheetContext: React.Context<SheetContextProps> = React.createContext<SheetContextProps>(null)

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
}: React.HTMLProps<typeof HTMLButtonElement> & {
  asChild?: boolean
}) {
  const context = useSheetContext()
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
      // @ts-ignore
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
  SheetClose,
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
    <Mount open={context.open} renderOnce={renderOnce} {...props}>
      <FloatingFocusManager context={floatingContext}>
        <div
          data-open={context.open}
          data-side={side}
          ref={ref}
          {...context.getFloatingProps(props)}
          style={{
            ...style,
            position: 'fixed',
            zIndex: 99,
          }}>
          {props.children}
          {context.closeButton && <SheetClose />}
        </div>
      </FloatingFocusManager>
    </Mount>
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
          '--duck-sheet-overlay-bg': 'oklch(0.12 0 0 / 0.83)',
          backdropFilter: 'blur(1px)',
          background: 'var(--duck-sheet-overlay-bg)',
          opacity: context.open ? 1 : 0,
          overflow: 'hidden',
          pointerEvents: context.open ? 'auto' : 'none',
          zIndex: 98,
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
    <div {...props} id={id} ref={ref}>
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
    <h2 {...props} id={id} ref={ref}>
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
    <p {...props} id={id} ref={ref}>
      {children}
    </p>
  )
}

function Portal({ children, ...props }: React.ComponentPropsWithRef<typeof FloatingPortal>) {
  return <FloatingPortal {...props}>{children}</FloatingPortal>
}

export { Root, Trigger, Content, Heading, Title, Description, Portal, SheetContext, Overlay }
