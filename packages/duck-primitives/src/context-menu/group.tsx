/** ContextMenuGroup -- groups related menu items together. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const GROUP_NAME = 'ContextMenuGroup'

type ContextMenuGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
interface IContextMenuGroupProps extends MenuGroupProps {}

const ContextMenuGroup = React.forwardRef<ContextMenuGroupElement, IContextMenuGroupProps>(
  (props: ScopedProps<IContextMenuGroupProps>, forwardedRef) => {
    const { __scopeContextMenu, ...groupProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />
  },
)

ContextMenuGroup.displayName = GROUP_NAME

export type { IContextMenuGroupProps }
export { ContextMenuGroup }
