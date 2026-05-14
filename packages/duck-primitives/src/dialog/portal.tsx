import * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import { Presence } from '../presence'
import { createDialogContext, useDialogContext } from './dialog'
import type { IDialog } from './dialog.types'

const PORTAL_NAME = 'DialogPortal'

export const [PortalProvider, usePortalContext] = createDialogContext<IDialog.IPortalContext>(PORTAL_NAME, {
  forceMount: undefined,
})

const DialogPortal: React.FC<IDialog.IPortalProps> = (props: IDialog.IScoped<IDialog.IPortalProps>) => {
  const { __scopeDialog, forceMount, children, container } = props
  const context = useDialogContext(PORTAL_NAME, __scopeDialog)
  return (
    <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
      {React.Children.map(children, (child) => (
        <Presence present={forceMount || context.open}>
          <PortalPrimitive asChild container={container}>
            {child}
          </PortalPrimitive>
        </Presence>
      ))}
    </PortalProvider>
  )
}

DialogPortal.displayName = PORTAL_NAME

export { DialogPortal }
