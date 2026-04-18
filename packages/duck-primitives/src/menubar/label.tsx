import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const LABEL_NAME = 'MenubarLabel'

type MenubarLabelElement = React.ComponentRef<typeof MenuPrimitive.Label>

const MenubarLabel = React.forwardRef<MenubarLabelElement, IMenubar.ILabelProps>(
  (props: IMenubar.IScoped<IMenubar.ILabelProps>, forwardedRef) => {
    const { __scopeMenubar, ...labelProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />
  },
)

MenubarLabel.displayName = LABEL_NAME

export { MenubarLabel }
