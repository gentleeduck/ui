/** MenubarSubContent renders the content panel of a nested submenu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const SUB_CONTENT_NAME = 'MenubarSubContent'

type MenubarSubContentElement = React.ComponentRef<typeof MenuPrimitive.Content>
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>
interface IMenubarSubContentProps extends MenuSubContentProps {}

const MenubarSubContent = React.forwardRef<MenubarSubContentElement, IMenubarSubContentProps>(
  (props: ScopedProps<IMenubarSubContentProps>, forwardedRef) => {
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
          // re-namespace exposed content custom properties
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

export type { IMenubarSubContentProps }
export { MenubarSubContent }
