import type * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { type ScopedProps, useDialogScope } from './alert-dialog'

const PORTAL_NAME = 'AlertDialogPortal'

type DialogPortalProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>
export interface IAlertDialogPortalProps extends DialogPortalProps {}

/** Renders alert dialog content into a React portal. */
const AlertDialogPortal: React.FC<IAlertDialogPortalProps> = (props: ScopedProps<IAlertDialogPortalProps>) => {
  const { __scopeAlertDialog, ...portalProps } = props
  const dialogScope = useDialogScope(__scopeAlertDialog)
  return <DialogPrimitive.Portal {...dialogScope} {...portalProps} />
}

AlertDialogPortal.displayName = PORTAL_NAME

export { AlertDialogPortal }
