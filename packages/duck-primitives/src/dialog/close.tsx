import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useDialogContext } from './dialog'

const CLOSE_NAME = 'DialogClose'

type DialogCloseElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
export interface DialogCloseProps extends PrimitiveButtonProps {}

/** Button that closes the dialog when clicked. */
export const DialogClose = React.forwardRef<DialogCloseElement, DialogCloseProps>(
  (props: ScopedProps<DialogCloseProps>, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props
    const context = useDialogContext(CLOSE_NAME, __scopeDialog)
    return (
      <Primitive.button
        type="button"
        {...closeProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(false))}
      />
    )
  },
)

DialogClose.displayName = CLOSE_NAME
