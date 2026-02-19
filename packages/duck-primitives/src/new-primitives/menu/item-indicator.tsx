/** MenuItemIndicator component - visual indicator for checked menu items. */
import * as React from 'react'
import { Presence } from '../presence'
import { Primitive } from '../primitive-elements'
import { useItemIndicatorContext } from './checkbox-item'
import type { ScopedProps } from './menu'
import { getCheckedState, isIndeterminate } from './utils'

const ITEM_INDICATOR_NAME = 'MenuItemIndicator'

type MenuItemIndicatorElement = React.ElementRef<typeof Primitive.span>
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>
interface MenuItemIndicatorProps extends PrimitiveSpanProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const MenuItemIndicator = React.forwardRef<MenuItemIndicatorElement, MenuItemIndicatorProps>(
  (props: ScopedProps<MenuItemIndicatorProps>, forwardedRef) => {
    const { __scopeMenu, forceMount, ...itemIndicatorProps } = props
    const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME, __scopeMenu)
    return (
      <Presence present={forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true}>
        <Primitive.span
          {...itemIndicatorProps}
          ref={forwardedRef}
          data-state={getCheckedState(indicatorContext.checked)}
        />
      </Presence>
    )
  },
)

MenuItemIndicator.displayName = ITEM_INDICATOR_NAME

export { MenuItemIndicator }
export type { MenuItemIndicatorProps, MenuItemIndicatorElement }
