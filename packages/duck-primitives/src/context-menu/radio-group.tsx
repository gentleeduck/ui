import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const RADIO_GROUP_NAME = 'ContextMenuRadioGroup'

type ContextMenuRadioGroupElement = React.ComponentRef<typeof MenuPrimitive.RadioGroup>

const ContextMenuRadioGroup = React.forwardRef<ContextMenuRadioGroupElement, IContextMenu.IRadioGroupProps>(
  (props: IContextMenu.IScoped<IContextMenu.IRadioGroupProps>, forwardedRef) => {
    const { __scopeContextMenu, ...radioGroupProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />
  },
)

ContextMenuRadioGroup.displayName = RADIO_GROUP_NAME

export { ContextMenuRadioGroup }
