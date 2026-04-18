import * as React from 'react'
import { flushSync } from 'react-dom'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { FocusGroupItem, LINK_SELECT, ROOT_CONTENT_DISMISS } from './navigation-menu.libs'
import type { INavigationMenu } from './navigation-menu.types'

const LINK_NAME = 'NavigationMenuLink'

type NavigationMenuLinkElement = React.ComponentRef<typeof Primitive.a>
type PrimitiveLinkProps = React.ComponentPropsWithoutRef<typeof Primitive.a>
interface INavigationMenuLinkProps extends Omit<PrimitiveLinkProps, 'onSelect'> {
  active?: boolean
  onSelect?: (event: Event) => void
}

const NavigationMenuLink = React.forwardRef<NavigationMenuLinkElement, INavigationMenuLinkProps>(
  (props: INavigationMenu.IScoped<INavigationMenuLinkProps>, forwardedRef) => {
    const { __scopeNavigationMenu, active, onSelect, ...linkProps } = props

    return (
      <FocusGroupItem asChild>
        <Primitive.a
          data-slot="navigation-menu-link"
          data-active={active ? '' : undefined}
          aria-current={active ? 'page' : undefined}
          {...linkProps}
          ref={forwardedRef}
          // biome-ignore lint/a11y/useValidAnchor: navigation-menu link is a primitive that composes anchor semantics  -  consumers provide href
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

export type { INavigationMenuLinkProps }
export { NavigationMenuLink }
