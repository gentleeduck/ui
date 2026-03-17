/** DropdownMenuRadioItem -- a menu item that acts as a radio button. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const RADIO_ITEM_NAME = 'DropdownMenuRadioItem'

type DropdownMenuRadioItemElement = React.ComponentRef<typeof MenuPrimitive.RadioItem>
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
interface DropdownMenuRadioItemProps extends MenuRadioItemProps {}

const DropdownMenuRadioItem = React.forwardRef<DropdownMenuRadioItemElement, DropdownMenuRadioItemProps>(
  (props: ScopedProps<DropdownMenuRadioItemProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...radioItemProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />
  },
)

DropdownMenuRadioItem.displayName = RADIO_ITEM_NAME

export type { DropdownMenuRadioItemProps }
export { DropdownMenuRadioItem }
