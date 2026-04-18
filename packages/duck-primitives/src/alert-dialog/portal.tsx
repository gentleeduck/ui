import type * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { useDialogScope } from './alert-dialog'
import type { IAlertDialog } from './alert-dialog.types'

const PORTAL_NAME = 'AlertDialogPortal'

/** Renders alert dialog content into a React portal. */
const AlertDialogPortal: React.FC<IAlertDialog.IPortalProps> = (
  props: IAlertDialog.IScoped<IAlertDialog.IPortalProps>,
) => {
  const { __scopeAlertDialog, ...portalProps } = props
  const dialogScope = useDialogScope(__scopeAlertDialog)
  return <DialogPrimitive.Portal {...dialogScope} {...portalProps} />
}

AlertDialogPortal.displayName = PORTAL_NAME

export { AlertDialogPortal }
