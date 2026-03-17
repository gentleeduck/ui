/** MenuLabel component - a non-interactive label within a menu. */
import * as React from 'react'
import { Primitive } from '../primitive-elements'

import { type ScopedProps, useMenuRootContext } from './menu'

const LABEL_NAME = 'MenuLabel'

type MenuLabelElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface MenuLabelProps extends PrimitiveDivProps {}

const MenuLabel = React.forwardRef<MenuLabelElement, MenuLabelProps>(
  (props: ScopedProps<MenuLabelProps>, forwardedRef) => {
    const { __scopeMenu, ...labelProps } = props
    const rootContext = useMenuRootContext(LABEL_NAME, __scopeMenu)
    return <Primitive.div data-slot="menu-label" dir={rootContext.dir} {...labelProps} ref={forwardedRef} />
  },
)

MenuLabel.displayName = LABEL_NAME

export type { MenuLabelElement, MenuLabelProps }
export { MenuLabel }
