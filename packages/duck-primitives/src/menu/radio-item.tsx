import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { ItemIndicatorProvider } from './checkbox-item'
import { MenuItem } from './item'
import { getCheckedState } from './menu.libs'
import type { IMenu } from './menu.types'
import { useRadioGroupContext } from './radio-group'

const RADIO_ITEM_NAME = 'MenuRadioItem'

type MenuRadioItemElement = React.ComponentRef<typeof MenuItem>

const MenuRadioItem = React.forwardRef<MenuRadioItemElement, IMenu.IRadioItemProps>(
  (props: IMenu.IScoped<IMenu.IRadioItemProps>, forwardedRef) => {
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

export { MenuRadioItem }
