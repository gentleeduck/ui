import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const SEPARATOR_NAME = 'DropdownMenuSeparator'

type DropdownMenuSeparatorElement = React.ComponentRef<typeof MenuPrimitive.Separator>

const DropdownMenuSeparator = React.forwardRef<DropdownMenuSeparatorElement, IDropdownMenu.ISeparatorProps>(
  (props: IDropdownMenu.IScoped<IDropdownMenu.ISeparatorProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...separatorProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />
  },
)

DropdownMenuSeparator.displayName = SEPARATOR_NAME

export { DropdownMenuSeparator }
