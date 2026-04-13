/** MenuItemIndicator component - visual indicator for checked menu items. */
import * as React from 'react'
import { Presence } from '../presence'
import { Primitive } from '../primitive-elements'
import { useItemIndicatorContext } from './checkbox-item'
import { type ScopedProps, useMenuRootContext } from './menu'
import { getCheckedState, isIndeterminate } from './menu.libs'

const ITEM_INDICATOR_NAME = 'MenuItemIndicator'

type MenuItemIndicatorElement = React.ComponentRef<typeof Primitive.span>
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>
interface IMenuItemIndicatorProps extends PrimitiveSpanProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const MenuItemIndicator = React.forwardRef<MenuItemIndicatorElement, IMenuItemIndicatorProps>(
  (props: ScopedProps<IMenuItemIndicatorProps>, forwardedRef) => {
    const { __scopeMenu, forceMount, ...itemIndicatorProps } = props
    const rootContext = useMenuRootContext(ITEM_INDICATOR_NAME, __scopeMenu)
    const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME, __scopeMenu)
    return (
      <Presence present={forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true}>
        <Primitive.span
          data-slot="menu-item-indicator"
          {...itemIndicatorProps}
          ref={forwardedRef}
          dir={rootContext.dir}
          data-state={getCheckedState(indicatorContext.checked)}
        />
      </Presence>
    )
  },
)

MenuItemIndicator.displayName = ITEM_INDICATOR_NAME

export type { IMenuItemIndicatorProps, MenuItemIndicatorElement }
export { MenuItemIndicator }
