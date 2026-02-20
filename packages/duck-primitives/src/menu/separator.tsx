/** MenuSeparator component - a visual separator between menu items. */
import * as React from 'react'
import { Primitive } from '../primitive-elements'

import type { ScopedProps } from './menu'

const SEPARATOR_NAME = 'MenuSeparator'

type MenuSeparatorElement = React.ElementRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface MenuSeparatorProps extends PrimitiveDivProps {}

const MenuSeparator = React.forwardRef<MenuSeparatorElement, MenuSeparatorProps>(
  (props: ScopedProps<MenuSeparatorProps>, forwardedRef) => {
    const { __scopeMenu, ...separatorProps } = props
    return <Primitive.div role="separator" aria-orientation="horizontal" {...separatorProps} ref={forwardedRef} />
  },
)

MenuSeparator.displayName = SEPARATOR_NAME

export { MenuSeparator }
export type { MenuSeparatorProps, MenuSeparatorElement }
