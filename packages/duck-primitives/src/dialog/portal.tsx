import * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import { Presence } from '../presence'
import { createDialogContext, type ScopedProps, useDialogContext } from './dialog'

const PORTAL_NAME = 'DialogPortal'

type PortalContextValue = { forceMount?: true }
export const [PortalProvider, usePortalContext] = createDialogContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
})

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>
export interface IDialogPortalProps {
  children?: React.ReactNode
  /** Container element to portal the content into. */
  container?: PortalProps['container']
  /** Force mounting for animation control. */
  forceMount?: true
}

/** Portals dialog content into a specified container (or document.body). */
const DialogPortal: React.FC<IDialogPortalProps> = (props: ScopedProps<IDialogPortalProps>) => {
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
