import type * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { createDialogScope } from '../dialog'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'

const ROOT_NAME = 'AlertDialog'

export type ScopedProps<P> = P & { __scopeAlertDialog?: Scope }
export const [createAlertDialogContext, createAlertDialogScope] = createContextScope(ROOT_NAME, [createDialogScope])
export const useDialogScope = createDialogScope()

type DialogProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
export interface IAlertDialogProps extends Omit<DialogProps, 'modal'> {}

/** Root component that wraps Dialog with modal behavior forced on. */
const AlertDialog: React.FC<IAlertDialogProps> = (props: ScopedProps<IAlertDialogProps>) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props
  const dialogScope = useDialogScope(__scopeAlertDialog)
  return <DialogPrimitive.Root {...dialogScope} {...alertDialogProps} modal={true} />
}

AlertDialog.displayName = ROOT_NAME

export { AlertDialog }
