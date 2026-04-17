import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const RADIO_GROUP_NAME = 'DropdownMenuRadioGroup'

type DropdownMenuRadioGroupElement = React.ComponentRef<typeof MenuPrimitive.RadioGroup>

const DropdownMenuRadioGroup = React.forwardRef<DropdownMenuRadioGroupElement, IDropdownMenu.IRadioGroupProps>(
  (props: IDropdownMenu.IScoped<IDropdownMenu.IRadioGroupProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...radioGroupProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />
  },
)

DropdownMenuRadioGroup.displayName = RADIO_GROUP_NAME

export { DropdownMenuRadioGroup }
