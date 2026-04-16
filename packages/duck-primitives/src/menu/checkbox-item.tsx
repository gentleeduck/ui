import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { MenuItem } from './item'
import { createMenuContext } from './menu'
import { getCheckedState, isIndeterminate } from './menu.libs'
import type { IMenu } from './menu.types'

const CHECKBOX_ITEM_NAME = 'MenuCheckboxItem'
const ITEM_INDICATOR_NAME = 'MenuItemIndicator'

type MenuCheckboxItemElement = React.ComponentRef<typeof MenuItem>

const [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext<IMenu.ICheckboxContext>(
  ITEM_INDICATOR_NAME,
  { checked: false },
)

const MenuCheckboxItem = React.forwardRef<MenuCheckboxItemElement, IMenu.ICheckboxItemProps>(
  (props: IMenu.IScoped<IMenu.ICheckboxItemProps>, forwardedRef) => {
    const { checked = false, onCheckedChange, ...checkboxItemProps } = props
    return (
      <ItemIndicatorProvider scope={props.__scopeMenu} checked={checked}>
        <MenuItem
          role="menuitemcheckbox"
          aria-checked={isIndeterminate(checked) ? 'mixed' : checked}
          {...checkboxItemProps}
          ref={forwardedRef}
          data-state={getCheckedState(checked)}
          onSelect={composeEventHandlers(
            checkboxItemProps.onSelect,
            () => onCheckedChange?.(isIndeterminate(checked) ? true : !checked),
            { checkForDefaultPrevented: false },
          )}
        />
      </ItemIndicatorProvider>
    )
  },
)

MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME

export { ItemIndicatorProvider, MenuCheckboxItem, useItemIndicatorContext }
