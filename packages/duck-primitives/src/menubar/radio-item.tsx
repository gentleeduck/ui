import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const RADIO_ITEM_NAME = 'MenubarRadioItem'

type MenubarRadioItemElement = React.ComponentRef<typeof MenuPrimitive.RadioItem>

const MenubarRadioItem = React.forwardRef<MenubarRadioItemElement, IMenubar.IRadioItemProps>(
  (props: IMenubar.IScoped<IMenubar.IRadioItemProps>, forwardedRef) => {
    const { __scopeMenubar, ...radioItemProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />
  },
)

MenubarRadioItem.displayName = RADIO_ITEM_NAME

export { MenubarRadioItem }
