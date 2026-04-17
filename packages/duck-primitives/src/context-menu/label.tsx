import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const LABEL_NAME = 'ContextMenuLabel'

type ContextMenuLabelElement = React.ComponentRef<typeof MenuPrimitive.Label>

const ContextMenuLabel = React.forwardRef<ContextMenuLabelElement, IContextMenu.ILabelProps>(
  (props: IContextMenu.IScoped<IContextMenu.ILabelProps>, forwardedRef) => {
    const { __scopeContextMenu, ...labelProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />
  },
)

ContextMenuLabel.displayName = LABEL_NAME

export { ContextMenuLabel }
