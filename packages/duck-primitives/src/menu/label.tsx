/** MenuLabel component - a non-interactive label within a menu. */
import * as React from 'react'
import { Primitive } from '../primitive-elements'

import type { ScopedProps } from './menu'

const LABEL_NAME = 'MenuLabel'

type MenuLabelElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface MenuLabelProps extends PrimitiveDivProps {}

const MenuLabel = React.forwardRef<MenuLabelElement, MenuLabelProps>(
  (props: ScopedProps<MenuLabelProps>, forwardedRef) => {
    const { __scopeMenu, ...labelProps } = props
    return <Primitive.div {...labelProps} ref={forwardedRef} />
  },
)

MenuLabel.displayName = LABEL_NAME

export { MenuLabel }
export type { MenuLabelProps, MenuLabelElement }
