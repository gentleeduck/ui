import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import * as MenuPrimitive from '../menu'
import { useMenubarMenuContext } from './menu'
import { useCollection, useMenubarContext, useMenuScope, wrapArray } from './menubar'
import type { IMenubar } from './menubar.types'

const CONTENT_NAME = 'MenubarContent'

type MenubarContentElement = React.ComponentRef<typeof MenuPrimitive.Content>

const MenubarContent = React.forwardRef<MenubarContentElement, IMenubar.IContentProps>(
  (props: IMenubar.IScoped<IMenubar.IContentProps>, forwardedRef) => {
    const { __scopeMenubar, align = 'start', ...contentProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    const context = useMenubarContext(CONTENT_NAME, __scopeMenubar)
    const menuContext = useMenubarMenuContext(CONTENT_NAME, __scopeMenubar)
    const getItems = useCollection(__scopeMenubar)
    const hasInteractedOutsideRef = React.useRef(false)

    return (
      <MenuPrimitive.Content
        id={menuContext.contentId}
        aria-labelledby={menuContext.triggerId}
        data-slot="menubar-content"
        {...menuScope}
        {...contentProps}
        ref={forwardedRef}
        align={align}
        onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
          const menubarOpen = Boolean(context.value)
          if (!menubarOpen && !hasInteractedOutsideRef.current) {
            menuContext.triggerRef.current?.focus()
          }

          hasInteractedOutsideRef.current = false
          event.preventDefault()
        })}
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) => {
          const target = event.target as HTMLElement
          const isMenubarTrigger = getItems().some((item) => item.ref.current?.contains(target))
          if (isMenubarTrigger) event.preventDefault()
        })}
        onInteractOutside={composeEventHandlers(props.onInteractOutside, () => {
          hasInteractedOutsideRef.current = true
        })}
        onEntryFocus={(event) => {
          if (!menuContext.wasKeyboardTriggerOpenRef.current) event.preventDefault()
        }}
        onKeyDown={composeEventHandlers(
          props.onKeyDown,
          (event) => {
            if (event.key === 'I' || event.key === 'A') {
              const items = getItems().filter((item) => !item.disabled)
              const values = items.map((item) => item.value)
              const isFirst = context.dir === 'rtl' ? event.key === 'A' : event.key === 'I'
              const targetValue = isFirst ? values[0] : values[values.length - 1]
              if (targetValue) {
                event.preventDefault()
                context.onMenuOpen(targetValue)
              }
              return
            }

            if (['ArrowRight', 'ArrowLeft', 'h', 'l'].includes(event.key)) {
              const target = event.target as HTMLElement
              const targetIsSubTrigger =
                target.closest('[data-slot="menubar-subtrigger"]') !== null ||
                target.closest('[data-gentleduck-menubar-subtrigger]') !== null
              const isKeyDownInsideSubMenu = target.closest('[role="menu"]') !== event.currentTarget

              const isPrevKey = event.key === 'ArrowLeft' || event.key === 'h'
              const isNextKey = event.key === 'ArrowRight' || event.key === 'l'

              if (isNextKey && targetIsSubTrigger && !isKeyDownInsideSubMenu) return

              const items = getItems().filter((item) => !item.disabled)
              let candidateValues = items.map((item) => item.value)
              if (isPrevKey) candidateValues.reverse()

              const currentIndex = candidateValues.indexOf(menuContext.value)

              candidateValues = context.loop
                ? wrapArray(candidateValues, currentIndex + 1)
                : candidateValues.slice(currentIndex + 1)

              const [nextValue] = candidateValues
              if (nextValue) {
                event.preventDefault()
                context.onMenuOpen(nextValue)
              }
            }
          },
          { checkForDefaultPrevented: false },
        )}
        style={{
          ...props.style,
          ...{
            '--gentleduck-menubar-content-transform-origin': 'var(--gentleduck-popper-transform-origin)',
            '--gentleduck-menubar-content-available-width': 'var(--gentleduck-popper-available-width)',
            '--gentleduck-menubar-content-available-height': 'var(--gentleduck-popper-available-height)',
            '--gentleduck-menubar-trigger-width': 'var(--gentleduck-popper-anchor-width)',
            '--gentleduck-menubar-trigger-height': 'var(--gentleduck-popper-anchor-height)',
          },
        }}
      />
    )
  },
)

MenubarContent.displayName = CONTENT_NAME

export { MenubarContent }
