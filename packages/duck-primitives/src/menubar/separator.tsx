import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const SEPARATOR_NAME = 'MenubarSeparator'

type MenubarSeparatorElement = React.ComponentRef<typeof MenuPrimitive.Separator>

const MenubarSeparator = React.forwardRef<MenubarSeparatorElement, IMenubar.ISeparatorProps>(
  (props: IMenubar.IScoped<IMenubar.ISeparatorProps>, forwardedRef) => {
    const { __scopeMenubar, ...separatorProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />
  },
)

MenubarSeparator.displayName = SEPARATOR_NAME

export { MenubarSeparator }
