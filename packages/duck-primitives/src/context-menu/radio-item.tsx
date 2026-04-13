/** ContextMenuRadioItem -- a selectable radio item within a radio group. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const RADIO_ITEM_NAME = 'ContextMenuRadioItem'

type ContextMenuRadioItemElement = React.ComponentRef<typeof MenuPrimitive.RadioItem>
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
interface IContextMenuRadioItemProps extends MenuRadioItemProps {}

const ContextMenuRadioItem = React.forwardRef<ContextMenuRadioItemElement, IContextMenuRadioItemProps>(
  (props: ScopedProps<IContextMenuRadioItemProps>, forwardedRef) => {
    const { __scopeContextMenu, ...radioItemProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />
  },
)

ContextMenuRadioItem.displayName = RADIO_ITEM_NAME

export type { IContextMenuRadioItemProps }
export { ContextMenuRadioItem }
