import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { useMenuRootContext } from './menu'
import type { IMenu } from './menu.types'

const LABEL_NAME = 'MenuLabel'

type MenuLabelElement = React.ComponentRef<typeof Primitive.div>

const MenuLabel = React.forwardRef<MenuLabelElement, IMenu.ILabelProps>(
  (props: IMenu.IScoped<IMenu.ILabelProps>, forwardedRef) => {
    const { __scopeMenu, ...labelProps } = props
    const rootContext = useMenuRootContext(LABEL_NAME, __scopeMenu)
    return <Primitive.div data-slot="menu-label" dir={rootContext.dir} {...labelProps} ref={forwardedRef} />
  },
)

MenuLabel.displayName = LABEL_NAME

export { MenuLabel }
