import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const GROUP_NAME = 'DropdownMenuGroup'

type DropdownMenuGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>

const DropdownMenuGroup = React.forwardRef<DropdownMenuGroupElement, IDropdownMenu.IGroupProps>(
  (props: IDropdownMenu.IScoped<IDropdownMenu.IGroupProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...groupProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />
  },
)

DropdownMenuGroup.displayName = GROUP_NAME

export { DropdownMenuGroup }
