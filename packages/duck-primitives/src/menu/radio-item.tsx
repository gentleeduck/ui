/** MenuRadioItem component - a radio-selectable menu item within a radio group. */
import * as React from 'react'

import { composeEventHandlers } from '../libs/compose-event-handler'
import { ItemIndicatorProvider } from './checkbox-item'
import { MenuItem, type IMenuItemProps } from './item'
import type { ScopedProps } from './menu'
import { getCheckedState } from './menu.libs'
import { useRadioGroupContext } from './radio-group'

const RADIO_ITEM_NAME = 'MenuRadioItem'

type MenuRadioItemElement = React.ComponentRef<typeof MenuItem>
interface IMenuRadioItemProps extends IMenuItemProps {
  value: string
}

const MenuRadioItem = React.forwardRef<MenuRadioItemElement, IMenuRadioItemProps>(
  (props: ScopedProps<IMenuRadioItemProps>, forwardedRef) => {
    const { value, ...radioItemProps } = props
    const context = useRadioGroupContext(RADIO_ITEM_NAME, props.__scopeMenu)
    const checked = value === context.value
    return (
      <ItemIndicatorProvider scope={props.__scopeMenu} checked={checked}>
        <MenuItem
          role="menuitemradio"
          aria-checked={checked}
          {...radioItemProps}
          ref={forwardedRef}
          data-state={getCheckedState(checked)}
          onSelect={composeEventHandlers(radioItemProps.onSelect, () => context.onValueChange?.(value), {
            checkForDefaultPrevented: false,
          })}
        />
      </ItemIndicatorProvider>
    )
  },
)

MenuRadioItem.displayName = RADIO_ITEM_NAME

export type { MenuRadioItemElement, IMenuRadioItemProps }
export { MenuRadioItem }
