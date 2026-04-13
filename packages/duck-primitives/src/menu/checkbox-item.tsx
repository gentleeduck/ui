/** MenuCheckboxItem component - a menu item with a checkbox toggle. */
import * as React from 'react'

import { composeEventHandlers } from '../libs/compose-event-handler'
import { type IMenuItemProps, MenuItem } from './item'
import { createMenuContext, type ScopedProps } from './menu'
import { type CheckedState, getCheckedState, isIndeterminate } from './menu.libs'

const CHECKBOX_ITEM_NAME = 'MenuCheckboxItem'
const ITEM_INDICATOR_NAME = 'MenuItemIndicator'

type MenuCheckboxItemElement = React.ComponentRef<typeof MenuItem>

interface IMenuCheckboxItemProps extends IMenuItemProps {
  checked?: CheckedState
  // `onCheckedChange` can never be called with `"indeterminate"` from the inside
  onCheckedChange?: (checked: boolean) => void
}

type CheckboxContextValue = { checked: CheckedState }

const [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext<CheckboxContextValue>(ITEM_INDICATOR_NAME, {
  checked: false,
})

const MenuCheckboxItem = React.forwardRef<MenuCheckboxItemElement, IMenuCheckboxItemProps>(
  (props: ScopedProps<IMenuCheckboxItemProps>, forwardedRef) => {
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

export type { IMenuCheckboxItemProps, MenuCheckboxItemElement }
export { ItemIndicatorProvider, MenuCheckboxItem, useItemIndicatorContext }
