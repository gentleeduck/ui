'use client'

import { useStableId } from '@gentleduck/hooks'
import React from 'react'
import { ShouldRender } from '../dialog'
import { Slot } from '../slot'
import { PopoverContext, usePopover, usePopoverContext } from './popover.hooks'
import { PopoverContentProps, PopoverRootProps } from './popover.types'

/**
 * Popover component that provides a context for managing its open state and
 * behavior. It uses a ref to handle the underlying HTMLPopoverElement.
 */
export function Root({
  children,
  open: openProp,
  onOpenChange,
  lockScroll = false,
  mouseEnter = false,
  mouseExist = false,
  modal = false,
  closeButton = false,

  skipDelayDuration = 300,
  delayDuration = 0,
  ...props
}: PopoverRootProps): React.JSX.Element {
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  const id = useStableId()
  const {
    open,
    onOpenChange: _onOpenChange,
    contentRef,
    triggerRef,
  } = usePopover({
    wrapperRef,
    open: openProp,
    onOpenChange,
    lockScroll,
    mouseExist,
    mouseEnter,
    modal,
    skipDelayDuration,
    delayDuration,
  })

  return (
    <PopoverContext.Provider
      value={{
        modal,
        wrapperRef,
        triggerRef,
        contentRef,
        open,
        onOpenChange: _onOpenChange,
        id,
        closeButton,
        mouseEnter,
        mouseExist,
      }}>
      <div {...props} duck-popover="" ref={wrapperRef} data-open={open}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

export function Trigger(props: React.ComponentPropsWithoutRef<typeof Slot>): React.JSX.Element {
  const { id, triggerRef, open, onOpenChange } = usePopoverContext()

  return (
    <Slot
      popoverTarget={id}
      style={
        {
          '--position-anchor': `--${id}`,
          anchorName: 'var(--position-anchor)',
        } as React.CSSProperties
      }
      aria-haspopup="dialog"
      aria-controls={id}
      data-open={open}
      duck-popover-trigger=""
      {...props}
      ref={triggerRef as React.RefObject<HTMLDivElement>}
    />
  )
}

export function Content({
  children,
  className,
  renderOnce = false,
  overlay = 'nothing',
  closedby = 'any',
  dialogClose,
  animation = 'default',
  sideOffset = 4,
  alignOffset = 0,
  side = 'top',
  align = 'center',
  ...props
}: PopoverContentProps) {
  const { contentRef, closeButton, id, modal, open, mouseEnter, mouseExist } = usePopoverContext()
  const DialogClose = dialogClose

  // Main axis margin based on `side`
  const sideMargins: Partial<CSSStyleDeclaration> =
    {
      top: { marginBottom: `${sideOffset}px` },
      bottom: { marginTop: `${sideOffset}px` },
      left: { marginRight: `${sideOffset}px` },
      right: { marginLeft: `${sideOffset}px` },
      inset: {},
    }[side as 'top' | 'bottom' | 'left' | 'right' | 'inset'] ?? {}

  // Cross-axis margin based on `align`
  const alignMargins: Partial<CSSStyleDeclaration> =
    side === 'top' || side === 'bottom'
      ? ({
          start: { marginLeft: `${alignOffset}px` },
          end: { marginRight: `${alignOffset}px` },
          center: {},
        }[align as 'start' | 'end' | 'center'] ?? {})
      : side === 'left' || side === 'right'
        ? ({
            start: { marginTop: `${alignOffset}px` },
            end: { marginBottom: `${alignOffset}px` },
            center: {},
          }[align as 'start' | 'end' | 'center'] ?? {})
        : {}

  const style = {
    '--position-anchor': `--${id}`,
    ...sideMargins,
    ...alignMargins,
  } as React.CSSProperties

  const isHover = (mouseEnter && mouseExist) || mouseEnter
  const Component = isHover ? 'div' : 'dialog'
  const popover = isHover ? undefined : modal ? 'manual' : 'auto'

  return (
    <Component
      style={style}
      className={className}
      data-open={open}
      {...({ ...props, closedby, popover } as never as React.HTMLProps<HTMLElement>)}
      id={id}
      duck-popover-content=""
      ref={contentRef as never}>
      {children}
    </Component>
  )
}

export default {
  Root,
  Trigger,
  Content,
}
