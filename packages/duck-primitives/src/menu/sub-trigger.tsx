import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { composeRefs } from '../libs/compose-ref'
import { MenuAnchor } from './anchor'
import { useMenuContentContext } from './content'
import { MenuItemImpl } from './item'
import { useMenuContext, useMenuRootContext } from './menu'
import { getOpenState, type Side, SUB_OPEN_KEYS, whenMouse } from './menu.libs'
import type { IMenu } from './menu.types'
import { useMenuSubContext } from './sub'

const SUB_TRIGGER_NAME = 'MenuSubTrigger'

type MenuSubTriggerElement = React.ComponentRef<typeof MenuItemImpl>

const MenuSubTrigger = React.forwardRef<MenuSubTriggerElement, IMenu.ISubTriggerProps>(
  (props: IMenu.IScoped<IMenu.ISubTriggerProps>, forwardedRef) => {
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
          onClick={(event) => {
            props.onClick?.(event)
            if (props.disabled || event.defaultPrevented) return
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
                const side = context.content?.dataset['side'] as Side
                const rightSide = side === 'right'
                const bleed = rightSide ? -5 : +5
                const contentNearEdge = contentRect[rightSide ? 'left' : 'right']
                const contentFarEdge = contentRect[rightSide ? 'right' : 'left']

                contentContext.onPointerGraceIntentChange({
                  area: [
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

                contentContext.onPointerGraceIntentChange(null)
              }
            }),
          )}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            const isTypingAhead = contentContext.searchRef.current !== ''
            if (props.disabled || (isTypingAhead && event.key === ' ')) return
            if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
              context.onOpenChange(true)
              context.content?.focus()
              event.preventDefault()
            }
          })}
        />
      </MenuAnchor>
    )
  },
)

MenuSubTrigger.displayName = SUB_TRIGGER_NAME

export { MenuSubTrigger }
