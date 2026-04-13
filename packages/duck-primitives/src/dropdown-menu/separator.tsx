/** DropdownMenuSeparator -- visual divider between menu items. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const SEPARATOR_NAME = 'DropdownMenuSeparator'

type DropdownMenuSeparatorElement = React.ComponentRef<typeof MenuPrimitive.Separator>
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
interface IDropdownMenuSeparatorProps extends MenuSeparatorProps {}

const DropdownMenuSeparator = React.forwardRef<DropdownMenuSeparatorElement, IDropdownMenuSeparatorProps>(
  (props: ScopedProps<IDropdownMenuSeparatorProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...separatorProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />
  },
)

DropdownMenuSeparator.displayName = SEPARATOR_NAME

export type { IDropdownMenuSeparatorProps }
export { DropdownMenuSeparator }
