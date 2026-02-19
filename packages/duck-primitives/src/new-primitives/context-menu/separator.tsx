/** ContextMenuSeparator -- visual divider between menu items. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const SEPARATOR_NAME = 'ContextMenuSeparator'

type ContextMenuSeparatorElement = React.ElementRef<typeof MenuPrimitive.Separator>
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
interface ContextMenuSeparatorProps extends MenuSeparatorProps {}

const ContextMenuSeparator = React.forwardRef<ContextMenuSeparatorElement, ContextMenuSeparatorProps>(
  (props: ScopedProps<ContextMenuSeparatorProps>, forwardedRef) => {
    const { __scopeContextMenu, ...separatorProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />
  },
)

ContextMenuSeparator.displayName = SEPARATOR_NAME

export { ContextMenuSeparator }
export type { ContextMenuSeparatorProps }
