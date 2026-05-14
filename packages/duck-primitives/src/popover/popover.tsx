import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import { createContextScope } from '../libs/create-context'
import * as PopperPrimitive from '../popper'
import { createPopperScope } from '../popper'
import type { IPopover } from './popover.types'

const POPOVER_NAME = 'Popover'

export const [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [createPopperScope])

export const usePopperScope = createPopperScope()

export const [PopoverProvider, usePopoverContext] = createPopoverContext<IPopover.IContext>(POPOVER_NAME)

export function Popover(props: IPopover.IScoped<IPopover.IProps>) {
  const { __scopePopover, children, open: openProp, defaultOpen, onOpenChange, dir, modal = false } = props

  const popperScope = usePopperScope(__scopePopover)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
  const direction = useDirection(dir)

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
