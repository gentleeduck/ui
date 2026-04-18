import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const LABEL_NAME = 'DropdownMenuLabel'

type DropdownMenuLabelElement = React.ComponentRef<typeof MenuPrimitive.Label>

const DropdownMenuLabel = React.forwardRef<DropdownMenuLabelElement, IDropdownMenu.ILabelProps>(
  (props: IDropdownMenu.IScoped<IDropdownMenu.ILabelProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...labelProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />
  },
)

DropdownMenuLabel.displayName = LABEL_NAME

export { DropdownMenuLabel }
