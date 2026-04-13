import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useDialogContext } from './dialog'

const CLOSE_NAME = 'DialogClose'

type DialogCloseElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
export interface IDialogCloseProps extends PrimitiveButtonProps {}

/** Button that closes the dialog when clicked. */
export const DialogClose = React.forwardRef<DialogCloseElement, IDialogCloseProps>(
  (props: ScopedProps<IDialogCloseProps>, forwardedRef) => {
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
