/** MenuSeparator component - a visual separator between menu items. */
import * as React from 'react'
import { Primitive } from '../primitive-elements'

import { type ScopedProps, useMenuRootContext } from './menu'

const SEPARATOR_NAME = 'MenuSeparator'

type MenuSeparatorElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface IMenuSeparatorProps extends PrimitiveDivProps {}

const MenuSeparator = React.forwardRef<MenuSeparatorElement, IMenuSeparatorProps>(
  (props: ScopedProps<IMenuSeparatorProps>, forwardedRef) => {
    const { __scopeMenu, ...separatorProps } = props
    const rootContext = useMenuRootContext(SEPARATOR_NAME, __scopeMenu)
    return (
      <Primitive.div
        data-slot="menu-separator"
        role="separator"
        aria-orientation="horizontal"
        dir={rootContext.dir}
        {...separatorProps}
        ref={forwardedRef}
      />
    )
  },
)

MenuSeparator.displayName = SEPARATOR_NAME

export type { IMenuSeparatorProps, MenuSeparatorElement }
export { MenuSeparator }
