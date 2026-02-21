/** MenubarGroup groups related menu items together. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const GROUP_NAME = 'MenubarGroup'

type MenubarGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
interface MenubarGroupProps extends MenuGroupProps {}

const MenubarGroup = React.forwardRef<MenubarGroupElement, MenubarGroupProps>(
  (props: ScopedProps<MenubarGroupProps>, forwardedRef) => {
    const { __scopeMenubar, ...groupProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />
  },
)

MenubarGroup.displayName = GROUP_NAME

export { MenubarGroup }
export type { MenubarGroupProps }
