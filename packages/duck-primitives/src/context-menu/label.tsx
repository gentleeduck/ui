/** ContextMenuLabel -- non-interactive label within a context menu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const LABEL_NAME = 'ContextMenuLabel'

type ContextMenuLabelElement = React.ComponentRef<typeof MenuPrimitive.Label>
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>
interface ContextMenuLabelProps extends MenuLabelProps {}

const ContextMenuLabel = React.forwardRef<ContextMenuLabelElement, ContextMenuLabelProps>(
  (props: ScopedProps<ContextMenuLabelProps>, forwardedRef) => {
    const { __scopeContextMenu, ...labelProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />
  },
)

ContextMenuLabel.displayName = LABEL_NAME

export { ContextMenuLabel }
export type { ContextMenuLabelProps }
