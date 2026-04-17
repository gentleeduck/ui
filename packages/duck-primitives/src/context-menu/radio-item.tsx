import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const RADIO_ITEM_NAME = 'ContextMenuRadioItem'

type ContextMenuRadioItemElement = React.ComponentRef<typeof MenuPrimitive.RadioItem>

const ContextMenuRadioItem = React.forwardRef<ContextMenuRadioItemElement, IContextMenu.IRadioItemProps>(
  (props: IContextMenu.IScoped<IContextMenu.IRadioItemProps>, forwardedRef) => {
    const { __scopeContextMenu, ...radioItemProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />
  },
)

ContextMenuRadioItem.displayName = RADIO_ITEM_NAME

export { ContextMenuRadioItem }
