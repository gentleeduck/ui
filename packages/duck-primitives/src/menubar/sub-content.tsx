import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const SUB_CONTENT_NAME = 'MenubarSubContent'

type MenubarSubContentElement = React.ComponentRef<typeof MenuPrimitive.Content>

const MenubarSubContent = React.forwardRef<MenubarSubContentElement, IMenubar.ISubContentProps>(
  (props: IMenubar.IScoped<IMenubar.ISubContentProps>, forwardedRef) => {
    const { __scopeMenubar, ...subContentProps } = props
    const menuScope = useMenuScope(__scopeMenubar)

    return (
      <MenuPrimitive.SubContent
        {...menuScope}
        data-slot="menubar-content"
        {...subContentProps}
        ref={forwardedRef}
        style={{
          ...props.style,
          ...{
            '--gentleduck-menubar-content-transform-origin': 'var(--gentleduck-popper-transform-origin)',
            '--gentleduck-menubar-content-available-width': 'var(--gentleduck-popper-available-width)',
            '--gentleduck-menubar-content-available-height': 'var(--gentleduck-popper-available-height)',
            '--gentleduck-menubar-trigger-width': 'var(--gentleduck-popper-anchor-width)',
            '--gentleduck-menubar-trigger-height': 'var(--gentleduck-popper-anchor-height)',
          },
        }}
      />
    )
  },
)

MenubarSubContent.displayName = SUB_CONTENT_NAME

export { MenubarSubContent }
