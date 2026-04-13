/** MenuAnchor component - anchors the menu to a reference element. */
import * as React from 'react'
import * as PopperPrimitive from '../popper'

import { type ScopedProps, usePopperScope } from './menu'

const ANCHOR_NAME = 'MenuAnchor'

type MenuAnchorElement = React.ComponentRef<typeof PopperPrimitive.Anchor>
type PopperAnchorProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Anchor>
interface IMenuAnchorProps extends PopperAnchorProps {}

const MenuAnchor = React.forwardRef<MenuAnchorElement, IMenuAnchorProps>(
  (props: ScopedProps<IMenuAnchorProps>, forwardedRef) => {
    const { __scopeMenu, ...anchorProps } = props
    const popperScope = usePopperScope(__scopeMenu)
    return <PopperPrimitive.Anchor {...popperScope} {...anchorProps} ref={forwardedRef} />
  },
)

MenuAnchor.displayName = ANCHOR_NAME

export type { IMenuAnchorProps, MenuAnchorElement }
export { MenuAnchor }
