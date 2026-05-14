import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { useDialogContext } from './dialog'
import type { IDialog } from './dialog.types'

const CLOSE_NAME = 'DialogClose'

type DialogCloseElement = React.ComponentRef<typeof Primitive.button>

export const DialogClose = React.forwardRef<DialogCloseElement, IDialog.ICloseProps>(
  (props: IDialog.IScoped<IDialog.ICloseProps>, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props
    const context = useDialogContext(CLOSE_NAME, __scopeDialog)
    return (
      <Primitive.button
        data-slot="dialog-close"
        type="button"
        dir={context.dir}
        {...closeProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(false))}
      />
    )
  },
)

DialogClose.displayName = CLOSE_NAME
