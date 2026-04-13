/** MenuSubContent component - the content area displayed within a submenu. */
import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Presence } from '../presence'
import {
  MenuContentImpl,
  type MenuContentImplElement,
  type MenuContentImplPrivateProps,
  type IMenuContentImplProps,
} from './content'
import { Collection, type ScopedProps, useMenuContext, useMenuRootContext } from './menu'
import { SUB_CLOSE_KEYS } from './menu.libs'
import { usePortalContext } from './portal'
import { useMenuSubContext } from './sub'

const CONTENT_NAME = 'MenuContent'
const SUB_CONTENT_NAME = 'MenuSubContent'

type MenuSubContentElement = MenuContentImplElement
interface IMenuSubContentProps
  extends Omit<
    IMenuContentImplProps,
    keyof MenuContentImplPrivateProps | 'onCloseAutoFocus' | 'onEntryFocus' | 'side' | 'align'
  > {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const MenuSubContent = React.forwardRef<MenuSubContentElement, IMenuSubContentProps>(
  (props: ScopedProps<IMenuSubContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeMenu)
    const { forceMount = portalContext.forceMount, ...subContentProps } = props
    const context = useMenuContext(CONTENT_NAME, props.__scopeMenu)
    const rootContext = useMenuRootContext(CONTENT_NAME, props.__scopeMenu)
    const subContext = useMenuSubContext(SUB_CONTENT_NAME, props.__scopeMenu)
    const ref = React.useRef<MenuSubContentElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    return (
      <Collection.Provider scope={props.__scopeMenu}>
        <Presence present={forceMount || context.open}>
          <Collection.Slot scope={props.__scopeMenu}>
            <MenuContentImpl
              id={subContext.contentId}
              aria-labelledby={subContext.triggerId}
              {...subContentProps}
              ref={composedRefs}
              align="start"
              side={rootContext.dir === 'rtl' ? 'left' : 'right'}
              disableOutsidePointerEvents={false}
              disableOutsideScroll={false}
              trapFocus={false}
              onOpenAutoFocus={(event) => {
                // when opening a submenu, focus content for keyboard users only
                if (rootContext.isUsingKeyboardRef.current) ref.current?.focus()
                event.preventDefault()
              }}
              // The menu might close because of focusing another menu item in the parent menu. We
              // don't want it to refocus the trigger in that case so we handle trigger focus ourselves.
              onCloseAutoFocus={(event) => event.preventDefault()}
              onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) => {
                // We prevent closing when the trigger is focused to avoid triggering a re-open animation
                // on pointer interaction.
                if (event.target !== subContext.trigger) context.onOpenChange(false)
              })}
              onEscapeKeyDown={composeEventHandlers(props.onEscapeKeyDown, (event) => {
                rootContext.onClose()
                // ensure pressing escape in submenu doesn't escape full screen mode
                event.preventDefault()
              })}
              onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
                // Submenu key events bubble through portals. We only care about keys in this menu.
                const isKeyDownInside = event.currentTarget.contains(event.target as HTMLElement)
                const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key)
                if (isKeyDownInside && isCloseKey) {
                  context.onOpenChange(false)
                  // We focus manually because we prevented it in `onCloseAutoFocus`
                  subContext.trigger?.focus()
                  // prevent window from scrolling
                  event.preventDefault()
                }
              })}
            />
          </Collection.Slot>
        </Presence>
      </Collection.Provider>
    )
  },
)

MenuSubContent.displayName = SUB_CONTENT_NAME

export type { MenuSubContentElement, IMenuSubContentProps }
export { MenuSubContent }
