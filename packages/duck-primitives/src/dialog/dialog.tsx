import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import { createContext, createContextScope } from '../libs/create-context'
import type { IDialog } from './dialog.types'

const DIALOG_NAME = 'Dialog'

export const [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME)

export const [DialogProvider, useDialogContext] = createDialogContext<IDialog.IContext>(DIALOG_NAME)

const Dialog: React.FC<IDialog.IProps> = (props: IDialog.IScoped<IDialog.IProps>) => {
  const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, dir, modal = true } = props
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<IDialog.DialogContentElement>(null)
  const direction = useDirection(dir)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME,
  })

  return (
    <DialogProvider
      scope={__scopeDialog}
      triggerRef={triggerRef}
      contentRef={contentRef}
      contentId={useId()}
      titleId={useId()}
      descriptionId={useId()}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
      modal={modal}
      dir={direction}>
      {children}
    </DialogProvider>
  )
}

Dialog.displayName = DIALOG_NAME

export function getState(open: boolean) {
  return open ? 'open' : 'closed'
}

const TITLE_WARNING_NAME = 'DialogTitleWarning'
const CONTENT_NAME = 'DialogContent'
const TITLE_NAME = 'DialogTitle'

export const [WarningProvider, useWarningContext] = createContext(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: 'dialog',
})

export { Dialog }
