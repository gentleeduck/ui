import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { type ScopedProps, useDialogScope } from './alert-dialog'

const DESCRIPTION_NAME = 'AlertDialogDescription'

type AlertDialogDescriptionElement = React.ComponentRef<typeof DialogPrimitive.Description>
type DialogDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
export interface IAlertDialogDescriptionProps extends DialogDescriptionProps {}

/** Accessible description for the alert dialog content. */
export const AlertDialogDescription = React.forwardRef<AlertDialogDescriptionElement, IAlertDialogDescriptionProps>(
  (props: ScopedProps<IAlertDialogDescriptionProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...descriptionProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Description {...dialogScope} {...descriptionProps} ref={forwardedRef} />
  },
)

AlertDialogDescription.displayName = DESCRIPTION_NAME
