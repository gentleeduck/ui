import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useDialogContext } from './dialog'

const DESCRIPTION_NAME = 'DialogDescription'

type DialogDescriptionElement = React.ComponentRef<typeof Primitive.p>
type PrimitiveParagraphProps = React.ComponentPropsWithoutRef<typeof Primitive.p>
export interface DialogDescriptionProps extends PrimitiveParagraphProps {}

/** Accessible description for the dialog. */
export const DialogDescription = React.forwardRef<DialogDescriptionElement, DialogDescriptionProps>(
  (props: ScopedProps<DialogDescriptionProps>, forwardedRef) => {
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
