import * as React from 'react'
import { useId } from '../hooks/use-id'
import { Primitive } from '../primitive-elements'
import { NavigationMenuItemContextProvider } from './navigation-menu'
import type { INavigationMenu } from './navigation-menu.types'
import { focusFirst, getTabbableCandidates, removeFromTabOrder } from './navigation-menu.libs'

const ITEM_NAME = 'NavigationMenuItem'

type NavigationMenuItemElement = React.ComponentRef<typeof Primitive.li>
type PrimitiveListItemProps = React.ComponentPropsWithoutRef<typeof Primitive.li>
interface INavigationMenuItemProps extends PrimitiveListItemProps {
  value?: string
}

const NavigationMenuItem = React.forwardRef<NavigationMenuItemElement, INavigationMenuItemProps>(
  (props: INavigationMenu.IScoped<INavigationMenuItemProps>, forwardedRef) => {
    const { __scopeNavigationMenu, value: valueProp, ...itemProps } = props
    const autoValue = useId()
    // We need to provide an initial deterministic value as `useId` will return
    // empty string on the first render and we don't want to match our internal "closed" value.
    const value = valueProp || autoValue || 'LEGACY_REACT_AUTO_VALUE'
    const contentRef = React.useRef<INavigationMenu.NavigationMenuContentImplElement>(null)
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const focusProxyRef = React.useRef<HTMLSpanElement>(null)
    const restoreContentTabOrderRef = React.useRef(() => {})
    const wasEscapeCloseRef = React.useRef(false)

    const handleContentEntry = React.useCallback((side = 'start') => {
      if (contentRef.current) {
        restoreContentTabOrderRef.current()
        const candidates = getTabbableCandidates(contentRef.current)
        if (candidates.length) focusFirst(side === 'start' ? candidates : candidates.reverse())
      }
    }, [])

    const handleContentExit = React.useCallback(() => {
      if (contentRef.current) {
        const candidates = getTabbableCandidates(contentRef.current)
        if (candidates.length) restoreContentTabOrderRef.current = removeFromTabOrder(candidates)
      }
    }, [])

    return (
      <NavigationMenuItemContextProvider
        scope={__scopeNavigationMenu}
        value={value}
        triggerRef={triggerRef}
        contentRef={contentRef}
        focusProxyRef={focusProxyRef}
        wasEscapeCloseRef={wasEscapeCloseRef}
        onEntryKeyDown={handleContentEntry}
        onFocusProxyEnter={handleContentEntry}
        onRootContentClose={handleContentExit}
        onContentFocusOutside={handleContentExit}>
        <Primitive.li data-slot="navigation-menu-item" {...itemProps} ref={forwardedRef} />
      </NavigationMenuItemContextProvider>
    )
  },
)

NavigationMenuItem.displayName = ITEM_NAME

export type { INavigationMenuItemProps }
export { NavigationMenuItem }
