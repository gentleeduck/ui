import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const GROUP_NAME = 'MenubarGroup'

type MenubarGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>

const MenubarGroup = React.forwardRef<MenubarGroupElement, IMenubar.IGroupProps>(
  (props: IMenubar.IScoped<IMenubar.IGroupProps>, forwardedRef) => {
    const { __scopeMenubar, ...groupProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />
  },
)

MenubarGroup.displayName = GROUP_NAME

export { MenubarGroup }
