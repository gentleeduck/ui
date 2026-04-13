/** MenuGroup component - groups related menu items together. */
import * as React from 'react'
import { Primitive } from '../primitive-elements'

import { type ScopedProps, useMenuRootContext } from './menu'

const GROUP_NAME = 'MenuGroup'

type MenuGroupElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface IMenuGroupProps extends PrimitiveDivProps {}

const MenuGroup = React.forwardRef<MenuGroupElement, IMenuGroupProps>(
  (props: ScopedProps<IMenuGroupProps>, forwardedRef) => {
    const { __scopeMenu, ...groupProps } = props
    const rootContext = useMenuRootContext(GROUP_NAME, __scopeMenu)
    return (
      <Primitive.div data-slot="menu-group" role="group" dir={rootContext.dir} {...groupProps} ref={forwardedRef} />
    )
  },
)

MenuGroup.displayName = GROUP_NAME

export type { IMenuGroupProps, MenuGroupElement }
export { MenuGroup }
