/** MenubarRadioItem renders a selectable radio option within a radio group. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const RADIO_ITEM_NAME = 'MenubarRadioItem'

type MenubarRadioItemElement = React.ComponentRef<typeof MenuPrimitive.RadioItem>
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
interface IMenubarRadioItemProps extends MenuRadioItemProps {}

const MenubarRadioItem = React.forwardRef<MenubarRadioItemElement, IMenubarRadioItemProps>(
  (props: ScopedProps<IMenubarRadioItemProps>, forwardedRef) => {
    const { __scopeMenubar, ...radioItemProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />
  },
)

MenubarRadioItem.displayName = RADIO_ITEM_NAME

export type { IMenubarRadioItemProps }
export { MenubarRadioItem }
