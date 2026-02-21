/** MenubarContent with CSS variable mapping, keyboard navigation, and data attributes. */
import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import * as MenuPrimitive from '../menu'
import { useMenubarMenuContext } from './menu'
import type { ScopedProps } from './menubar'
import { useCollection, useMenubarContext, useMenuScope, wrapArray } from './menubar'

const CONTENT_NAME = 'MenubarContent'

type MenubarContentElement = React.ComponentRef<typeof MenuPrimitive.Content>
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>
interface MenubarContentProps extends Omit<MenuContentProps, 'onEntryFocus'> {}

const MenubarContent = React.forwardRef<MenubarContentElement, MenubarContentProps>(
  (props: ScopedProps<MenubarContentProps>, forwardedRef) => {
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
        data-gentleduck-menubar-content=""
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
          // Always prevent auto focus because we either focus manually or want user agent focus
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
            if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
              const target = event.target as HTMLElement
              const targetIsSubTrigger = target.hasAttribute('data-gentleduck-menubar-subtrigger')
              const isKeyDownInsideSubMenu = target.closest('[data-gentleduck-menubar-content]') !== event.currentTarget

              const prevMenuKey = context.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
              const isPrevKey = prevMenuKey === event.key
              const isNextKey = !isPrevKey

              // Prevent navigation when we're opening a submenu
              if (isNextKey && targetIsSubTrigger) return
              // or we're inside a submenu and are moving backwards to close it
              if (isKeyDownInsideSubMenu && isPrevKey) return

              const items = getItems().filter((item) => !item.disabled)
              let candidateValues = items.map((item) => item.value)
              if (isPrevKey) candidateValues.reverse()

              const currentIndex = candidateValues.indexOf(menuContext.value)

              candidateValues = context.loop
                ? wrapArray(candidateValues, currentIndex + 1)
                : candidateValues.slice(currentIndex + 1)

              const [nextValue] = candidateValues
              if (nextValue) context.onMenuOpen(nextValue)
            }
          },
          { checkForDefaultPrevented: false },
        )}
        style={{
          ...props.style,
          // re-namespace exposed content custom properties
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
export type { MenubarContentProps }
