/** DropdownMenuRadioGroup -- groups radio items with shared value state. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const RADIO_GROUP_NAME = 'DropdownMenuRadioGroup'

type DropdownMenuRadioGroupElement = React.ComponentRef<typeof MenuPrimitive.RadioGroup>
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>
interface DropdownMenuRadioGroupProps extends MenuRadioGroupProps {}

const DropdownMenuRadioGroup = React.forwardRef<DropdownMenuRadioGroupElement, DropdownMenuRadioGroupProps>(
  (props: ScopedProps<DropdownMenuRadioGroupProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...radioGroupProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />
  },
)

DropdownMenuRadioGroup.displayName = RADIO_GROUP_NAME

export type { DropdownMenuRadioGroupProps }
export { DropdownMenuRadioGroup }
