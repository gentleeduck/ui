import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { useDialogContext } from './dialog'
import type { IDialog } from './dialog.types'

const TITLE_NAME = 'DialogTitle'

type DialogTitleElement = React.ComponentRef<typeof Primitive.h2>

export const DialogTitle = React.forwardRef<DialogTitleElement, IDialog.ITitleProps>(
  (props: IDialog.IScoped<IDialog.ITitleProps>, forwardedRef) => {
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
