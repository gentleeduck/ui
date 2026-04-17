import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const SUB_CONTENT_NAME = 'DropdownMenuSubContent'

type DropdownMenuSubContentElement = React.ComponentRef<typeof MenuPrimitive.Content>

const DropdownMenuSubContent = React.forwardRef<DropdownMenuSubContentElement, IDropdownMenu.ISubContentProps>(
  (props: IDropdownMenu.IScoped<IDropdownMenu.ISubContentProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...subContentProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)

    return (
      <MenuPrimitive.SubContent
        {...menuScope}
        {...subContentProps}
        ref={forwardedRef}
        style={{
          ...props.style,
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

export { DropdownMenuSubContent }
