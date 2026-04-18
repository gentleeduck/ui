import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useContextMenuContext, useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const CONTENT_NAME = 'ContextMenuContent'

type ContextMenuContentElement = React.ComponentRef<typeof MenuPrimitive.Content>

const ContextMenuContent = React.forwardRef<ContextMenuContentElement, IContextMenu.IContentProps>(
  (props: IContextMenu.IScoped<IContextMenu.IContentProps>, forwardedRef) => {
    const { __scopeContextMenu, ...contentProps } = props
    const context = useContextMenuContext(CONTENT_NAME, __scopeContextMenu)
    const menuScope = useMenuScope(__scopeContextMenu)
    const hasInteractedOutsideRef = React.useRef(false)

    return (
      <MenuPrimitive.Content
        {...menuScope}
        {...contentProps}
        ref={forwardedRef}
        side="right"
        sideOffset={2}
        align="start"
        onCloseAutoFocus={(event) => {
          props.onCloseAutoFocus?.(event)

          if (!event.defaultPrevented && hasInteractedOutsideRef.current) {
            event.preventDefault()
          }

          hasInteractedOutsideRef.current = false
        }}
        onInteractOutside={(event) => {
          props.onInteractOutside?.(event)

          if (!event.defaultPrevented && !context.modal) hasInteractedOutsideRef.current = true
        }}
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

ContextMenuContent.displayName = CONTENT_NAME

export { ContextMenuContent }
