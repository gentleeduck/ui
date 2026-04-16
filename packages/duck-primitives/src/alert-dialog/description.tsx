import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { useDialogScope } from './alert-dialog'
import type { IAlertDialog } from './alert-dialog.types'

const DESCRIPTION_NAME = 'AlertDialogDescription'

type AlertDialogDescriptionElement = React.ComponentRef<typeof DialogPrimitive.Description>

/** Accessible description for the alert dialog content. */
export const AlertDialogDescription = React.forwardRef<AlertDialogDescriptionElement, IAlertDialog.IDescriptionProps>(
  (props: IAlertDialog.IScoped<IAlertDialog.IDescriptionProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...descriptionProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Description {...dialogScope} {...descriptionProps} ref={forwardedRef} />
  },
)

AlertDialogDescription.displayName = DESCRIPTION_NAME
