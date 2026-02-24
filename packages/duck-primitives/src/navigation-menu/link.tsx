import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { flushSync } from 'react-dom'
import { Primitive } from '../primitive-elements'
import type { ScopedProps } from './navigation-menu'
import { FocusGroupItem, LINK_SELECT, ROOT_CONTENT_DISMISS } from './navigation-menu.libs'

const LINK_NAME = 'NavigationMenuLink'

type NavigationMenuLinkElement = React.ComponentRef<typeof Primitive.a>
type PrimitiveLinkProps = React.ComponentPropsWithoutRef<typeof Primitive.a>
interface NavigationMenuLinkProps extends Omit<PrimitiveLinkProps, 'onSelect'> {
  active?: boolean
  onSelect?: (event: Event) => void
}

const NavigationMenuLink = React.forwardRef<NavigationMenuLinkElement, NavigationMenuLinkProps>(
  (props: ScopedProps<NavigationMenuLinkProps>, forwardedRef) => {
    const { __scopeNavigationMenu, active, onSelect, ...linkProps } = props

    return (
      <FocusGroupItem asChild>
        <Primitive.a
          data-slot="navigation-menu-link"
          data-active={active ? '' : undefined}
          aria-current={active ? 'page' : undefined}
          {...linkProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(
            props.onClick,
            (event) => {
              const target = event.target as HTMLElement
              const linkSelectEvent = new CustomEvent(LINK_SELECT, {
                bubbles: true,
                cancelable: true,
              })
              target.addEventListener(LINK_SELECT, (event) => onSelect?.(event), { once: true })
              flushSync(() => target.dispatchEvent(linkSelectEvent))

              if (!linkSelectEvent.defaultPrevented && !event.metaKey) {
                const rootContentDismissEvent = new CustomEvent(ROOT_CONTENT_DISMISS, {
                  bubbles: true,
                  cancelable: true,
                })
                flushSync(() => target.dispatchEvent(rootContentDismissEvent))
              }
            },
            { checkForDefaultPrevented: false },
          )}
        />
      </FocusGroupItem>
    )
  },
)

NavigationMenuLink.displayName = LINK_NAME

export { NavigationMenuLink }
export type { NavigationMenuLinkProps }
