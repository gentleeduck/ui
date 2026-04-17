import * as React from 'react'
import type { IDirection } from '../direction'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import { createContextScope, type Scope } from '../libs/create-context'
import * as PopperPrimitive from '../popper'
import { createPopperScope } from '../popper'

const POPOVER_NAME = 'Popover'

export type ScopedProps<P> = P & { __scopePopover?: Scope }

export const [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [createPopperScope])

export const usePopperScope = createPopperScope()

type PopoverContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement | null>
  contentId: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  hasCustomAnchor: boolean
  onCustomAnchorAdd(): void
  onCustomAnchorRemove(): void
  modal: boolean
  dir: IDirection.Kind
}

export const [PopoverProvider, usePopoverContext] = createPopoverContext<PopoverContextValue>(POPOVER_NAME)

export interface IPopoverProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  dir?: IDirection.Kind
}

/**
 * Root popover component. Manages open/closed state and provides context
 * to all child components. Supports both controlled and uncontrolled usage.
 */
export function Popover(props: ScopedProps<IPopoverProps>) {
  const { __scopePopover, children, open: openProp, defaultOpen, onOpenChange, dir, modal = false } = props

  const popperScope = usePopperScope(__scopePopover)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
  const direction = useDirection(dir)

  // Supports controlled (open prop) and uncontrolled (defaultOpen) modes
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: POPOVER_NAME,
  })

  return (
    <PopperPrimitive.Popper {...popperScope}>
      <PopoverProvider
        scope={__scopePopover}
        contentId={useId()}
        triggerRef={triggerRef}
        open={open}
        onOpenChange={setOpen}
        onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
        hasCustomAnchor={hasCustomAnchor}
        onCustomAnchorAdd={React.useCallback(() => setHasCustomAnchor(true), [])}
        onCustomAnchorRemove={React.useCallback(() => setHasCustomAnchor(false), [])}
        modal={modal}
        dir={direction}>
        {children}
      </PopoverProvider>
    </PopperPrimitive.Popper>
  )
}

Popover.displayName = POPOVER_NAME
