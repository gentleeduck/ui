/** ContextMenuRadioGroup -- groups radio items for single-selection. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const RADIO_GROUP_NAME = 'ContextMenuRadioGroup'

type ContextMenuRadioGroupElement = React.ComponentRef<typeof MenuPrimitive.RadioGroup>
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>
interface IContextMenuRadioGroupProps extends MenuRadioGroupProps {}

const ContextMenuRadioGroup = React.forwardRef<ContextMenuRadioGroupElement, IContextMenuRadioGroupProps>(
  (props: ScopedProps<IContextMenuRadioGroupProps>, forwardedRef) => {
    const { __scopeContextMenu, ...radioGroupProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />
  },
)

ContextMenuRadioGroup.displayName = RADIO_GROUP_NAME

export type { IContextMenuRadioGroupProps }
export { ContextMenuRadioGroup }
