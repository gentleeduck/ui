'use client'

import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useMergeRefs } from '@floating-ui/react'
import * as React from 'react'
import { Mount } from '../mount'
import { useDialog, useDialogContext } from './dialog.hooks'
import { DialogContextProps, DialogOptions } from './dialog.types'
import { cleanLockScrollbar, lockScrollbar } from './dialog.libs'

const DialogContext = React.createContext<DialogContextProps>(null)

function Root({
  children,
  ...options
}: {
  children: React.ReactNode
} & DialogOptions) {
  const dialog = useDialog(options)
  return <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>
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
  const context = useDialogContext()
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
  dialogClose: DialogClose,
  lockScroll = false,
  ...props
}: React.HTMLProps<HTMLDivElement> &
  React.ComponentPropsWithoutRef<typeof Mount> & {
    withPortal?: boolean
    lockScroll?: boolean
    dialogClose?: React.FC
  }) {
  const { context: floatingContext, ...context } = useDialogContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])

  return (
    <FloatingFocusManager context={floatingContext}>
      <div
        ref={ref}
        style={{
          ...{
            transform: `scale(${context.open ? 1 : 0.9})`,
            pointerEvents: context.open ? 'auto' : 'none',
          },
          ...style,
        }}
        data-open={context.open}
        {...context.getFloatingProps(props)}>
        {
          <Mount
            open={context.open}
            ref={ref as never}
            forceMount={forceMount}
            waitForRender={waitForRender}
            renderOnce={renderOnce}
            {...props}>
            {context.closeButton && <DialogClose />}
            {props.children}
          </Mount>
        }
      </div>
    </FloatingFocusManager>
  )
}

function OverLay({ children, lockScroll = true, ...props }: React.ComponentPropsWithRef<typeof FloatingOverlay>) {
  const { ...context } = useDialogContext()

  React.useEffect(() => {
    if (lockScroll && context.open) {
      lockScrollbar(true)
    }
    return () => cleanLockScrollbar()
  }, [lockScroll, context.open])

  return (
    <FloatingOverlay
      style={
        {
          transition: 'opacity 200ms ease-in-out',
          pointerEvents: context.open ? 'auto' : 'none',
          opacity: context.open ? 1 : 0,
          zIndex: 100,
          '--duck-overlay-bg': 'oklch(0.12 0 0 / 0.83)',
          backdropFilter: 'blur(1px)',
          background: 'var(--duck-overlay-bg)',
          display: 'grid',
          placeContent: 'center',
          overflow: 'hidden',
        } as React.CSSProperties
      }
      {...props}>
      {children}
    </FloatingOverlay>
  )
}

function Heading({ children, ref, ...props }: React.HTMLProps<HTMLHeadingElement>) {
  const { setLabelId } = useDialogContext()
  const id = React.useId()

  // Only sets `aria-labelledby` on the Dialog root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setLabelId(id)
    return () => setLabelId(undefined)
  }, [id, setLabelId])

  return (
    <h2 {...props} ref={ref} id={id}>
      {children}
    </h2>
  )
}

function Title({ children, ref, ...props }: React.HTMLProps<HTMLParagraphElement>) {
  const { setTitleId } = useDialogContext()
  const id = React.useId()

  // Only sets `aria-describedby` on the Dialog root element
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
  const { setDescriptionId } = useDialogContext()
  const id = React.useId()

  // Only sets `aria-describedby` on the Dialog root element
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

function Close(props: React.HTMLProps<HTMLButtonElement>) {
  const { setOpen } = useDialogContext()
  return <button {...props} ref={props?.ref} onClick={() => setOpen(false)} type="button" />
}

function Portal({ children, ...props }: React.ComponentPropsWithRef<typeof FloatingPortal>) {
  return <FloatingPortal {...props}>{children}</FloatingPortal>
}

export { Root, Trigger, Content, Heading, Title, Description, Close, Portal, DialogContext, OverLay }
