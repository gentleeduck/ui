import * as React from 'react'
import type { IDirection } from '../direction'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import type { Scope } from '../libs/create-context'
import { createContext, createContextScope } from '../libs/create-context'

const DIALOG_NAME = 'Dialog'

export type ScopedProps<P> = P & { __scopeDialog?: Scope }
export const [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME)

type DialogContentElement = HTMLDivElement

export type DialogContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement | null>
  contentRef: React.RefObject<DialogContentElement | null>
  contentId: string
  titleId: string
  descriptionId: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  modal: boolean
  dir: IDirection.Kind
}

export const [DialogProvider, useDialogContext] = createDialogContext<DialogContextValue>(DIALOG_NAME)

export interface IDialogProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  modal?: boolean
  dir?: IDirection.Kind
}

/** Manages open/closed state and provides context to all child components. */
const Dialog: React.FC<IDialogProps> = (props: ScopedProps<IDialogProps>) => {
  const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, dir, modal = true } = props
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<DialogContentElement>(null)
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
