import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { type ScopedProps, useDialogScope } from './alert-dialog'

const TITLE_NAME = 'AlertDialogTitle'

type AlertDialogTitleElement = React.ComponentRef<typeof DialogPrimitive.Title>
type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
export interface AlertDialogTitleProps extends DialogTitleProps {}

/** Accessible title for the alert dialog. */
export const AlertDialogTitle = React.forwardRef<AlertDialogTitleElement, AlertDialogTitleProps>(
  (props: ScopedProps<AlertDialogTitleProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Title {...dialogScope} {...titleProps} ref={forwardedRef} />
  },
)

AlertDialogTitle.displayName = TITLE_NAME
