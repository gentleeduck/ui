import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { ScopedProps } from './navigation-menu'
import { Collection, useNavigationMenuContext } from './navigation-menu'
import { FocusGroup } from './navigation-menu.libs'

const LIST_NAME = 'NavigationMenuList'

type NavigationMenuListElement = React.ComponentRef<typeof Primitive.ul>
type PrimitiveUnorderedListProps = React.ComponentPropsWithoutRef<typeof Primitive.ul>
interface INavigationMenuListProps extends PrimitiveUnorderedListProps {}

const NavigationMenuList = React.forwardRef<NavigationMenuListElement, INavigationMenuListProps>(
  (props: ScopedProps<INavigationMenuListProps>, forwardedRef) => {
    const { __scopeNavigationMenu, ...listProps } = props
    const context = useNavigationMenuContext(LIST_NAME, __scopeNavigationMenu)

    const list = (
      <Primitive.ul
        data-slot="navigation-menu-list"
        data-orientation={context.orientation}
        {...listProps}
        ref={forwardedRef}
      />
    )

    return (
      <Primitive.div
        data-slot="navigation-menu-list-wrapper"
        style={{ position: 'relative' }}
        ref={context.onIndicatorTrackChange}>
        <Collection.Slot scope={__scopeNavigationMenu}>
          {context.isRootMenu ? <FocusGroup asChild>{list}</FocusGroup> : list}
        </Collection.Slot>
      </Primitive.div>
    )
  },
)

NavigationMenuList.displayName = LIST_NAME

export type { INavigationMenuListProps }
export { NavigationMenuList }
