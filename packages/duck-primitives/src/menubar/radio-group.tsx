/** MenubarRadioGroup groups radio items for single-selection within a menu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const RADIO_GROUP_NAME = 'MenubarRadioGroup'

type MenubarRadioGroupElement = React.ComponentRef<typeof MenuPrimitive.RadioGroup>
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>
interface IMenubarRadioGroupProps extends MenuRadioGroupProps {}

const MenubarRadioGroup = React.forwardRef<MenubarRadioGroupElement, IMenubarRadioGroupProps>(
  (props: ScopedProps<IMenubarRadioGroupProps>, forwardedRef) => {
    const { __scopeMenubar, ...radioGroupProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />
  },
)

MenubarRadioGroup.displayName = RADIO_GROUP_NAME

export type { IMenubarRadioGroupProps }
export { MenubarRadioGroup }
