/** DropdownMenuTrigger -- button that toggles the dropdown menu. */
import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { composeRefs } from '../libs/compose-ref'
import * as MenuPrimitive from '../menu'
import { Primitive } from '../primitive-elements'
import type { ScopedProps } from './dropdown-menu'
import { useDropdownMenuContext, useMenuScope } from './dropdown-menu'

const TRIGGER_NAME = 'DropdownMenuTrigger'

type DropdownMenuTriggerElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
interface IDropdownMenuTriggerProps extends PrimitiveButtonProps {
  disabled?: boolean
}

const DropdownMenuTrigger = React.forwardRef<DropdownMenuTriggerElement, IDropdownMenuTriggerProps>(
  (props: ScopedProps<IDropdownMenuTriggerProps>, forwardedRef) => {
    const { __scopeDropdownMenu, disabled = false, ...triggerProps } = props
    const context = useDropdownMenuContext(TRIGGER_NAME, __scopeDropdownMenu)
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return (
      <MenuPrimitive.Anchor asChild {...menuScope}>
        <Primitive.button
          data-slot="dropdown-menu-trigger"
          type="button"
          dir={context.dir}
          id={context.triggerId}
          aria-haspopup="menu"
          aria-expanded={context.open}
          aria-controls={context.open ? context.contentId : undefined}
          data-state={context.open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          {...triggerProps}
          ref={composeRefs(forwardedRef, context.triggerRef)}
          onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
            // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
            // but not when the control key is pressed (avoiding MacOS right click)
            if (!disabled && event.button === 0 && event.ctrlKey === false) {
              context.onOpenToggle()
              // prevent trigger focusing when opening
              // this allows the content to be given focus without competition
              if (!context.open) event.preventDefault()
            }
          })}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            if (disabled) return
            if (['Enter', ' '].includes(event.key)) context.onOpenToggle()
            if (event.key === 'ArrowDown') context.onOpenChange(true)
            // prevent keydown from scrolling window / first focused item to execute
            // that keydown (inadvertently closing the menu)
            if (['Enter', ' ', 'ArrowDown'].includes(event.key)) event.preventDefault()
          })}
        />
      </MenuPrimitive.Anchor>
    )
  },
)

DropdownMenuTrigger.displayName = TRIGGER_NAME

export type { IDropdownMenuTriggerProps }
export { DropdownMenuTrigger }
