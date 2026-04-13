/** MenubarTrigger button that opens a menu on click or keyboard interaction. */
import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import * as MenuPrimitive from '../menu'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { useMenubarMenuContext } from './menu'
import type { MenubarTriggerElement, ScopedProps } from './menubar'
import { Collection, useMenubarContext, useMenuScope, useRovingFocusGroupScope } from './menubar'

const TRIGGER_NAME = 'MenubarTrigger'

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
interface IMenubarTriggerProps extends PrimitiveButtonProps {}

const MenubarTrigger = React.forwardRef<MenubarTriggerElement, IMenubarTriggerProps>(
  (props: ScopedProps<IMenubarTriggerProps>, forwardedRef) => {
    const { __scopeMenubar, disabled = false, ...triggerProps } = props
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar)
    const menuScope = useMenuScope(__scopeMenubar)
    const context = useMenubarContext(TRIGGER_NAME, __scopeMenubar)
    const menuContext = useMenubarMenuContext(TRIGGER_NAME, __scopeMenubar)
    const ref = React.useRef<MenubarTriggerElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref, menuContext.triggerRef)
    const [isFocused, setIsFocused] = React.useState(false)
    const open = context.value === menuContext.value

    return (
      <Collection.ItemSlot scope={__scopeMenubar} value={menuContext.value} disabled={disabled}>
        <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable={!disabled} tabStopId={menuContext.value}>
          <MenuPrimitive.Anchor asChild {...menuScope}>
            <Primitive.button
              data-slot="menubar-trigger"
              type="button"
              role="menuitem"
              id={menuContext.triggerId}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={open ? menuContext.contentId : undefined}
              data-highlighted={isFocused ? '' : undefined}
              data-state={open ? 'open' : 'closed'}
              data-disabled={disabled ? '' : undefined}
              disabled={disabled}
              {...triggerProps}
              ref={composedRefs}
              onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
                // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
                // but not when the control key is pressed (avoiding MacOS right click)
                if (!disabled && event.button === 0 && event.ctrlKey === false) {
                  context.onMenuOpen(menuContext.value)
                  // prevent trigger focusing when opening
                  // this allows the content to be given focus without competition
                  if (!open) event.preventDefault()
                }
              })}
              onPointerEnter={composeEventHandlers(props.onPointerEnter, () => {
                const menubarOpen = Boolean(context.value)
                if (menubarOpen && !open) {
                  context.onMenuOpen(menuContext.value)
                  ref.current?.focus()
                }
              })}
              onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
                if (disabled) return
                if (['Enter', ' '].includes(event.key)) context.onMenuToggle(menuContext.value)
                if (event.key === 'ArrowDown') context.onMenuOpen(menuContext.value)
                // prevent keydown from scrolling window / first focused item to execute
                // that keydown (inadvertently closing the menu)
                if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
                  menuContext.wasKeyboardTriggerOpenRef.current = true
                  event.preventDefault()
                }
              })}
              onFocus={composeEventHandlers(props.onFocus, () => setIsFocused(true))}
              onBlur={composeEventHandlers(props.onBlur, () => setIsFocused(false))}
            />
          </MenuPrimitive.Anchor>
        </RovingFocusGroup.Item>
      </Collection.ItemSlot>
    )
  },
)

MenubarTrigger.displayName = TRIGGER_NAME

export type { IMenubarTriggerProps }
export { MenubarTrigger }
