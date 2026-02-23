import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { getState, type ScopedProps, useDialogContext } from './dialog'

const TRIGGER_NAME = 'DialogTrigger'

type DialogTriggerElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
export interface DialogTriggerProps extends PrimitiveButtonProps {}

/** Button that toggles the dialog open state. */
export const DialogTrigger = React.forwardRef<DialogTriggerElement, DialogTriggerProps>(
  (props: ScopedProps<DialogTriggerProps>, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog)
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef)
    return (
      <Primitive.button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={getState(context.open)}
        {...triggerProps}
        ref={composedTriggerRef}
        onClick={composeEventHandlers(props.onClick, context.onOpenToggle)}
      />
    )
  },
)

DialogTrigger.displayName = TRIGGER_NAME
