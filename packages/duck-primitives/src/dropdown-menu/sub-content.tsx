/** DropdownMenuSubContent -- positioned content area for a nested submenu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const SUB_CONTENT_NAME = 'DropdownMenuSubContent'

type DropdownMenuSubContentElement = React.ComponentRef<typeof MenuPrimitive.Content>
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>
interface IDropdownMenuSubContentProps extends MenuSubContentProps {}

const DropdownMenuSubContent = React.forwardRef<DropdownMenuSubContentElement, IDropdownMenuSubContentProps>(
  (props: ScopedProps<IDropdownMenuSubContentProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...subContentProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)

    return (
      <MenuPrimitive.SubContent
        {...menuScope}
        {...subContentProps}
        ref={forwardedRef}
        style={{
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            '--gentleduck-dropdown-menu-content-transform-origin': 'var(--gentleduck-popper-transform-origin)',
            '--gentleduck-dropdown-menu-content-available-width': 'var(--gentleduck-popper-available-width)',
            '--gentleduck-dropdown-menu-content-available-height': 'var(--gentleduck-popper-available-height)',
            '--gentleduck-dropdown-menu-trigger-width': 'var(--gentleduck-popper-anchor-width)',
            '--gentleduck-dropdown-menu-trigger-height': 'var(--gentleduck-popper-anchor-height)',
          },
        }}
      />
    )
  },
)

DropdownMenuSubContent.displayName = SUB_CONTENT_NAME

export type { IDropdownMenuSubContentProps }
export { DropdownMenuSubContent }
