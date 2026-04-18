import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { usePopperScope } from './menu'
import type { IMenu } from './menu.types'

const ANCHOR_NAME = 'MenuAnchor'

type MenuAnchorElement = React.ComponentRef<typeof PopperPrimitive.Anchor>

const MenuAnchor = React.forwardRef<MenuAnchorElement, IMenu.IAnchorProps>(
  (props: IMenu.IScoped<IMenu.IAnchorProps>, forwardedRef) => {
    const { __scopeMenu, ...anchorProps } = props
    const popperScope = usePopperScope(__scopeMenu)
    return <PopperPrimitive.Anchor {...popperScope} {...anchorProps} ref={forwardedRef} />
  },
)

MenuAnchor.displayName = ANCHOR_NAME

export { MenuAnchor }
