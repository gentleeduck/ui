/** MenubarGroup groups related menu items together. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const GROUP_NAME = 'MenubarGroup'

type MenubarGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
interface IMenubarGroupProps extends MenuGroupProps {}

const MenubarGroup = React.forwardRef<MenubarGroupElement, IMenubarGroupProps>(
  (props: ScopedProps<IMenubarGroupProps>, forwardedRef) => {
    const { __scopeMenubar, ...groupProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />
  },
)

MenubarGroup.displayName = GROUP_NAME

export type { IMenubarGroupProps }
export { MenubarGroup }
