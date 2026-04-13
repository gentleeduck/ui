import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useDialogContext } from './dialog'

const TITLE_NAME = 'DialogTitle'

type DialogTitleElement = React.ComponentRef<typeof Primitive.h2>
type PrimitiveHeading2Props = React.ComponentPropsWithoutRef<typeof Primitive.h2>
export interface IDialogTitleProps extends PrimitiveHeading2Props {}

/** Accessible title for the dialog. Required for screen readers. */
export const DialogTitle = React.forwardRef<DialogTitleElement, IDialogTitleProps>(
  (props: ScopedProps<IDialogTitleProps>, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props
    const context = useDialogContext(TITLE_NAME, __scopeDialog)
    return (
      <Primitive.h2
        data-slot="dialog-title"
        id={context.titleId}
        dir={context.dir}
        {...titleProps}
        ref={forwardedRef}
      />
    )
  },
)

DialogTitle.displayName = TITLE_NAME
