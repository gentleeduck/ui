/** MenuGroup component - groups related menu items together. */
import * as React from 'react'
import { Primitive } from '../primitive-elements'

import type { ScopedProps } from './menu'

const GROUP_NAME = 'MenuGroup'

type MenuGroupElement = React.ElementRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface MenuGroupProps extends PrimitiveDivProps {}

const MenuGroup = React.forwardRef<MenuGroupElement, MenuGroupProps>(
  (props: ScopedProps<MenuGroupProps>, forwardedRef) => {
    const { __scopeMenu, ...groupProps } = props
    return <Primitive.div role="group" {...groupProps} ref={forwardedRef} />
  },
)

MenuGroup.displayName = GROUP_NAME

export { MenuGroup }
export type { MenuGroupProps, MenuGroupElement }
