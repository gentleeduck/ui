import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { getState, useDialogContext } from './dialog'
import type { IDialog } from './dialog.types'

const TRIGGER_NAME = 'DialogTrigger'

type DialogTriggerElement = React.ComponentRef<typeof Primitive.button>

export const DialogTrigger = React.forwardRef<DialogTriggerElement, IDialog.ITriggerProps>(
  (props: IDialog.IScoped<IDialog.ITriggerProps>, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog)
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef)
    return (
      <Primitive.button
        data-slot="dialog-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={getState(context.open)}
        dir={context.dir}
        {...triggerProps}
        ref={composedTriggerRef}
        onClick={composeEventHandlers(props.onClick, context.onOpenToggle)}
      />
    )
  },
)

DialogTrigger.displayName = TRIGGER_NAME
