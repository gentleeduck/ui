import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { useDialogContext } from './dialog'
import type { IDialog } from './dialog.types'

const DESCRIPTION_NAME = 'DialogDescription'

type DialogDescriptionElement = React.ComponentRef<typeof Primitive.p>

/** Accessible description for the dialog. */
export const DialogDescription = React.forwardRef<DialogDescriptionElement, IDialog.IDescriptionProps>(
  (props: IDialog.IScoped<IDialog.IDescriptionProps>, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog)
    return (
      <Primitive.p
        data-slot="dialog-description"
        id={context.descriptionId}
        dir={context.dir}
        {...descriptionProps}
        ref={forwardedRef}
      />
    )
  },
)

DialogDescription.displayName = DESCRIPTION_NAME
