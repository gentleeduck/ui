'use client'
import { useMergeRefs } from '@floating-ui/react'
import { useStableId } from '@gentleduck/hooks'
import { apply as applyClosedBy, isSupported as isClosedBySupported } from 'dialog-closedby-polyfill'
import { apply as applyInvokers, isSupported as isInvokersSupported } from 'invokers-polyfill/fn'
import React from 'react'
import { MountMinimal } from '../mount'
import { useDialog, useDialogContext } from './dialog.hooks'
import type { DialogContentProps, DialogContextType, DialogProps } from './dialog.types'

if (!isClosedBySupported()) {
  applyClosedBy()
}

if (!isInvokersSupported()) {
  applyInvokers()
}

/**
 * Context for managing the open state of the dialog.
 */
export const DialogContext = React.createContext<DialogContextType | null>(null)

/**
 * Dialog component that provides a context for managing its open state and
 * behavior. It uses a ref to handle the underlying HTMLDialogElement.
 */
export function Root({
  children,
  open: openProp,
  onOpenChange,
  lockScroll = true,
  modal = true,
  closeButton = false,
  ...props
}: Omit<DialogProps, 'wrapperRef'> & React.HtmlHTMLAttributes<HTMLDivElement>): React.JSX.Element {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const {
    open,
    onOpenChange: _onOpenChange,
    triggerRef,
    contentRef,
  } = useDialog({
    wrapperRef,
    closeButton,
    children,
    open: openProp,
    onOpenChange,
    lockScroll,
    modal,
  })
  const id = useStableId()

  return (
    <DialogContext.Provider
      value={{
        wrapperRef,
        triggerRef,
        contentRef,
        open,
        onOpenChange: _onOpenChange,
        id,
        modal,
        closeButton,
        lockScroll,
      }}>
      <div {...props} duck-dialog="" ref={wrapperRef}>
        {children}
      </div>
    </DialogContext.Provider>
  )
}

export function Trigger({
  children,
  asChild = false,
  ref: propRef,
  onClick,
  ...props
}: React.HTMLProps<HTMLElement> & {
  asChild?: boolean
}) {
  const { onOpenChange, open, id, triggerRef } = useDialogContext()

  const mergedRef = useMergeRefs([triggerRef as React.Ref<HTMLButtonElement>, propRef])

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ...(children.props as any),
      ref: mergedRef,
      'aria-haspopup': 'dialog',
      'aria-controls': id,
      'data-open': open,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        onOpenChange(!open)
        onClick?.(e)
        // @ts-ignore
        if (children.props.onClick) children.props.onClick(e)
      },
    })
  }

  return (
    <button
      ref={mergedRef}
      // @ts-ignore
      type="button"
      aria-haspopup="dialog"
      aria-controls={id}
      data-open={open}
      children={children}
      onClick={(e) => {
        onOpenChange(!open)
        onClick?.(e)
      }}
      {...props}
    />
  )
}

export function Content({
  children,
  className,
  renderOnce = false,
  overlay = 'default',
  closedby = 'any',
  dialogClose,
  animation = 'default',
  ...props
}: DialogContentProps) {
  const { contentRef, closeButton, open, id } = useDialogContext()
  const prop = { props, closedby }
  const DialogClose = dialogClose

  return (
    <div className={String(open && 'absolute inset-0 z-50 flex min-h-screen w-full items-center justify-center')}>
      <dialog
        className={className}
        {...prop}
        id={id}
        ref={contentRef}
        style={{ transform: `scale(${open ? 1 : 0.95})` }}>
        <MountMinimal ref={contentRef.current} renderOnce={renderOnce} open={open}>
          {children}
          {closeButton && <DialogClose />}
        </MountMinimal>
      </dialog>
    </div>
  )
}
