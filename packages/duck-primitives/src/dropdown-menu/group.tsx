/** DropdownMenuGroup -- groups related menu items together. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const GROUP_NAME = 'DropdownMenuGroup'

type DropdownMenuGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
interface IDropdownMenuGroupProps extends MenuGroupProps {}

const DropdownMenuGroup = React.forwardRef<DropdownMenuGroupElement, IDropdownMenuGroupProps>(
  (props: ScopedProps<IDropdownMenuGroupProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...groupProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />
  },
)

DropdownMenuGroup.displayName = GROUP_NAME

export type { IDropdownMenuGroupProps }
export { DropdownMenuGroup }
