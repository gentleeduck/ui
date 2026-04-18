import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const SUB_CONTENT_NAME = 'ContextMenuSubContent'

type ContextMenuSubContentElement = React.ComponentRef<typeof MenuPrimitive.Content>

const ContextMenuSubContent = React.forwardRef<ContextMenuSubContentElement, IContextMenu.ISubContentProps>(
  (props: IContextMenu.IScoped<IContextMenu.ISubContentProps>, forwardedRef) => {
    const { __scopeContextMenu, ...subContentProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)

    return (
      <MenuPrimitive.SubContent
        {...menuScope}
        {...subContentProps}
        ref={forwardedRef}
        style={{
          ...props.style,
          ...{
            '--gentleduck-context-menu-content-transform-origin': 'var(--gentleduck-popper-transform-origin)',
            '--gentleduck-context-menu-content-available-width': 'var(--gentleduck-popper-available-width)',
            '--gentleduck-context-menu-content-available-height': 'var(--gentleduck-popper-available-height)',
            '--gentleduck-context-menu-trigger-width': 'var(--gentleduck-popper-anchor-width)',
            '--gentleduck-context-menu-trigger-height': 'var(--gentleduck-popper-anchor-height)',
          },
        }}
      />
    )
  },
)

ContextMenuSubContent.displayName = SUB_CONTENT_NAME

export { ContextMenuSubContent }
