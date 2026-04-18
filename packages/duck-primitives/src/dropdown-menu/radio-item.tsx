import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const RADIO_ITEM_NAME = 'DropdownMenuRadioItem'

type DropdownMenuRadioItemElement = React.ComponentRef<typeof MenuPrimitive.RadioItem>

const DropdownMenuRadioItem = React.forwardRef<DropdownMenuRadioItemElement, IDropdownMenu.IRadioItemProps>(
  (props: IDropdownMenu.IScoped<IDropdownMenu.IRadioItemProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...radioItemProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />
  },
)

DropdownMenuRadioItem.displayName = RADIO_ITEM_NAME

export { DropdownMenuRadioItem }
