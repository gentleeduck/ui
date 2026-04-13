/** DropdownMenuLabel -- a non-interactive label for a group of items. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const LABEL_NAME = 'DropdownMenuLabel'

type DropdownMenuLabelElement = React.ComponentRef<typeof MenuPrimitive.Label>
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>
interface IDropdownMenuLabelProps extends MenuLabelProps {}

const DropdownMenuLabel = React.forwardRef<DropdownMenuLabelElement, IDropdownMenuLabelProps>(
  (props: ScopedProps<IDropdownMenuLabelProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...labelProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />
  },
)

DropdownMenuLabel.displayName = LABEL_NAME

export type { IDropdownMenuLabelProps }
export { DropdownMenuLabel }
