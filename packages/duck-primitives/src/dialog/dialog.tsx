'use client'

import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useMergeRefs } from '@floating-ui/react'
import * as React from 'react'
import { Mount } from '../mount'
import { Slot } from '../slot'
import { useDialog, useDialogContext } from './dialog.hooks'
import { cleanLockScrollbar, lockScrollbar } from './dialog.libs'
import { DialogContextProps, DialogOptions } from './dialog.types'

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
}: React.HTMLProps<typeof HTMLButtonElement> & {
  asChild?: boolean
}) {
  const context = useDialogContext()
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
          // @ts-ignore
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
        // @ts-ignore
        onClick?.(e)
      }}
      // @ts-ignore
      {...context.getReferenceProps(props)}>
      {children}
    </Comp>
  )
}

function Content({
  style,
  ref: propRef,
  dialogClose: DialogClose,
  renderOnce = false,
  forceMount = false,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  forceMount?: boolean
  renderOnce?: boolean
  dialogClose?: React.FC<any>
}) {
  const { context: floatingContext, ...context } = useDialogContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])

  return (
    <FloatingFocusManager context={floatingContext} modal={context.modal}>
      <div
        ref={ref}
        style={{
          transform: `scale(${context.open ? 1 : 0.9})`,
          ...style,
          position: 'fixed',
        }}
        data-open={context.open}
        {...context.getFloatingProps(props)}>
        <Mount open={context.open} renderOnce={renderOnce}>
          {props.children}
          {context.closeButton && (
            // @ts-ignore
            <DialogClose />
          )}
        </Mount>
      </div>
    </FloatingFocusManager>
  )
}

function Overlay({ children, lockScroll = true, ...props }: React.ComponentPropsWithRef<typeof FloatingOverlay>) {
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
          pointerEvents: context.open ? 'auto' : 'none',
          opacity: context.open ? 1 : 0,
          zIndex: 49,
          '--duck-dialog-overlay-bg': 'oklch(0.12 0 0 / 0.83)',
          backdropFilter: 'blur(1px)',
          background: 'var(--duck-dialog-overlay-bg)',
          overflow: 'hidden',
        } as React.CSSProperties
      }
      {...props}>
      {children}
    </FloatingOverlay>
  )
}

function Heading({ children, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  const { setLabelId } = useDialogContext()
  const id = React.useId()

  // Only sets `aria-labelledby` on the Dialog root element
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

function Close(props: React.ComponentPropsWithRef<typeof Slot>) {
  const { setOpen } = useDialogContext()
  return <Slot {...props} ref={props?.ref} onClick={() => setOpen(false)} />
}

function Portal({ children, ...props }: React.ComponentPropsWithRef<typeof FloatingPortal>) {
  return <FloatingPortal {...props}>{children}</FloatingPortal>
}

export { Root, Trigger, Content, Heading, Title, Description, Close, Portal, DialogContext, Overlay }
