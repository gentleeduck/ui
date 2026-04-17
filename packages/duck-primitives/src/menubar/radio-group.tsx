import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const RADIO_GROUP_NAME = 'MenubarRadioGroup'

type MenubarRadioGroupElement = React.ComponentRef<typeof MenuPrimitive.RadioGroup>

const MenubarRadioGroup = React.forwardRef<MenubarRadioGroupElement, IMenubar.IRadioGroupProps>(
  (props: IMenubar.IScoped<IMenubar.IRadioGroupProps>, forwardedRef) => {
    const { __scopeMenubar, ...radioGroupProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />
  },
)

MenubarRadioGroup.displayName = RADIO_GROUP_NAME

export { MenubarRadioGroup }
