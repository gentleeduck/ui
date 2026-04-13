/** ContextMenuSeparator -- visual divider between menu items. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const SEPARATOR_NAME = 'ContextMenuSeparator'

type ContextMenuSeparatorElement = React.ComponentRef<typeof MenuPrimitive.Separator>
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
interface IContextMenuSeparatorProps extends MenuSeparatorProps {}

const ContextMenuSeparator = React.forwardRef<ContextMenuSeparatorElement, IContextMenuSeparatorProps>(
  (props: ScopedProps<IContextMenuSeparatorProps>, forwardedRef) => {
    const { __scopeContextMenu, ...separatorProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />
  },
)

ContextMenuSeparator.displayName = SEPARATOR_NAME

export type { IContextMenuSeparatorProps }
export { ContextMenuSeparator }
