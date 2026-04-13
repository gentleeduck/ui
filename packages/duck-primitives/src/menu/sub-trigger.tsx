/** MenuSubTrigger component - triggers the opening of a submenu. */
import * as React from 'react'

import { composeEventHandlers } from '../libs/compose-event-handler'
import { composeRefs } from '../libs/compose-ref'
import { MenuAnchor } from './anchor'
import { useMenuContentContext } from './content'
import { type IMenuItemImplProps, MenuItemImpl } from './item'
import { type ScopedProps, useMenuContext, useMenuRootContext } from './menu'
import { getOpenState, type Side, SUB_OPEN_KEYS, whenMouse } from './menu.libs'
import { useMenuSubContext } from './sub'

const SUB_TRIGGER_NAME = 'MenuSubTrigger'

type MenuSubTriggerElement = React.ComponentRef<typeof MenuItemImpl>
interface IMenuSubTriggerProps extends IMenuItemImplProps {}

const MenuSubTrigger = React.forwardRef<MenuSubTriggerElement, IMenuSubTriggerProps>(
  (props: ScopedProps<IMenuSubTriggerProps>, forwardedRef) => {
    const context = useMenuContext(SUB_TRIGGER_NAME, props.__scopeMenu)
    const rootContext = useMenuRootContext(SUB_TRIGGER_NAME, props.__scopeMenu)
    const subContext = useMenuSubContext(SUB_TRIGGER_NAME, props.__scopeMenu)
    const contentContext = useMenuContentContext(SUB_TRIGGER_NAME, props.__scopeMenu)
    const openTimerRef = React.useRef<number | null>(null)
    const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext
    const scope = { __scopeMenu: props.__scopeMenu }

    const clearOpenTimer = React.useCallback(() => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }, [])

    React.useEffect(() => clearOpenTimer, [clearOpenTimer])

    React.useEffect(() => {
      const pointerGraceTimer = pointerGraceTimerRef.current
      return () => {
        window.clearTimeout(pointerGraceTimer)
        onPointerGraceIntentChange(null)
      }
    }, [pointerGraceTimerRef, onPointerGraceIntentChange])

    return (
      <MenuAnchor asChild {...scope}>
        <MenuItemImpl
          id={subContext.triggerId}
          aria-haspopup="menu"
          aria-expanded={context.open}
          aria-controls={subContext.contentId}
          data-state={getOpenState(context.open)}
          {...props}
          ref={composeRefs(forwardedRef, subContext.onTriggerChange)}
          // This is redundant for mouse users but we cannot determine pointer type from
          // click event and we cannot use pointerup event (see git history for reasons why)
          onClick={(event) => {
            props.onClick?.(event)
            if (props.disabled || event.defaultPrevented) return
            /**
             * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
             * and we rely heavily on `onFocusOutside` for submenus to close when switching
             * between separate submenus.
             */
            event.currentTarget.focus()
            if (!context.open) context.onOpenChange(true)
          }}
          onPointerMove={composeEventHandlers(
            props.onPointerMove,
            whenMouse((event) => {
              contentContext.onItemEnter(event)
              if (event.defaultPrevented) return
              if (!props.disabled && !context.open && !openTimerRef.current) {
                contentContext.onPointerGraceIntentChange(null)
                openTimerRef.current = window.setTimeout(() => {
                  context.onOpenChange(true)
                  clearOpenTimer()
                }, 100)
              }
            }),
          )}
          onPointerLeave={composeEventHandlers(
            props.onPointerLeave,
            whenMouse((event) => {
              clearOpenTimer()

              const contentRect = context.content?.getBoundingClientRect()
              if (contentRect) {
                // Side is read from the `data-side` attribute set by the Popper (Floating UI).
                // It always reflects the actual computed placement of the submenu content.
                const side = context.content?.dataset.side as Side
                const rightSide = side === 'right'
                const bleed = rightSide ? -5 : +5
                const contentNearEdge = contentRect[rightSide ? 'left' : 'right']
                const contentFarEdge = contentRect[rightSide ? 'right' : 'left']

                contentContext.onPointerGraceIntentChange({
                  area: [
                    // Apply a bleed on clientX to ensure that our exit point is
                    // consistently within polygon bounds
                    { x: event.clientX + bleed, y: event.clientY },
                    { x: contentNearEdge, y: contentRect.top },
                    { x: contentFarEdge, y: contentRect.top },
                    { x: contentFarEdge, y: contentRect.bottom },
                    { x: contentNearEdge, y: contentRect.bottom },
                  ],
                  side,
                })

                window.clearTimeout(pointerGraceTimerRef.current)
                pointerGraceTimerRef.current = window.setTimeout(
                  () => contentContext.onPointerGraceIntentChange(null),
                  300,
                )
              } else {
                contentContext.onTriggerLeave(event)
                if (event.defaultPrevented) return

                // There's 100ms where the user may leave an item before the submenu was opened.
                contentContext.onPointerGraceIntentChange(null)
              }
            }),
          )}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            const isTypingAhead = contentContext.searchRef.current !== ''
            if (props.disabled || (isTypingAhead && event.key === ' ')) return
            if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
              context.onOpenChange(true)
              // The trigger may hold focus if opened via pointer interaction
              // so we ensure content is given focus again when switching to keyboard.
              context.content?.focus()
              // prevent window from scrolling
              event.preventDefault()
            }
          })}
        />
      </MenuAnchor>
    )
  },
)

MenuSubTrigger.displayName = SUB_TRIGGER_NAME

export type { IMenuSubTriggerProps, MenuSubTriggerElement }
export { MenuSubTrigger }
