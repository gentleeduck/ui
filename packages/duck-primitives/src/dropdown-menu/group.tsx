/** DropdownMenuGroup -- groups related menu items together. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const GROUP_NAME = 'DropdownMenuGroup'

type DropdownMenuGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
interface DropdownMenuGroupProps extends MenuGroupProps {}

const DropdownMenuGroup = React.forwardRef<DropdownMenuGroupElement, DropdownMenuGroupProps>(
  (props: ScopedProps<DropdownMenuGroupProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...groupProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />
  },
)

DropdownMenuGroup.displayName = GROUP_NAME

export type { DropdownMenuGroupProps }
export { DropdownMenuGroup }
