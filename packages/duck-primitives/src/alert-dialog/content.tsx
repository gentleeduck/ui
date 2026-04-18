import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { createSlottable } from '../slot'
import { createAlertDialogContext, useDialogScope } from './alert-dialog'
import type { IAlertDialog } from './alert-dialog.types'

const CONTENT_NAME = 'AlertDialogContent'
const TITLE_NAME = 'AlertDialogTitle'
const DESCRIPTION_NAME = 'AlertDialogDescription'

type AlertDialogCancelElement = React.ComponentRef<typeof DialogPrimitive.Close>

export const [AlertDialogContentProvider, useAlertDialogContentContext] =
  createAlertDialogContext<IAlertDialog.IContentContextValue>(CONTENT_NAME)

type AlertDialogContentElement = React.ComponentRef<typeof DialogPrimitive.Content>

const Slottable = createSlottable('AlertDialogContent')

/** Alert dialog content area with forced modal behavior and accessibility defaults. */
export const AlertDialogContent = React.forwardRef<AlertDialogContentElement, IAlertDialog.IContentProps>(
  (props: IAlertDialog.IScoped<IAlertDialog.IContentProps>, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    const contentRef = React.useRef<AlertDialogContentElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)
    const cancelRef = React.useRef<AlertDialogCancelElement | null>(null)

    return (
      <DialogPrimitive.WarningProvider contentName={CONTENT_NAME} titleName={TITLE_NAME} docsSlug="alert-dialog">
        <AlertDialogContentProvider scope={__scopeAlertDialog} cancelRef={cancelRef}>
          <DialogPrimitive.Content
            role="alertdialog"
            {...dialogScope}
            {...contentProps}
            ref={composedRefs}
            onOpenAutoFocus={composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              event.preventDefault()
              cancelRef.current?.focus({ preventScroll: true })
            })}
            onPointerDownOutside={(event) => event.preventDefault()}
            onInteractOutside={(event) => event.preventDefault()}>
            <Slottable>{children}</Slottable>
            {process.env.NODE_ENV === 'development' && <DescriptionWarning contentRef={contentRef} />}
          </DialogPrimitive.Content>
        </AlertDialogContentProvider>
      </DialogPrimitive.WarningProvider>
    )
  },
)

AlertDialogContent.displayName = CONTENT_NAME

type DescriptionWarningProps = {
  contentRef: React.RefObject<AlertDialogContentElement | null>
}

/** Dev-only warning when alert dialog content is missing a description. */
const DescriptionWarning: React.FC<DescriptionWarningProps> = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use a VisuallyHidden component as a wrapper around your description component.

For more information, see the alert-dialog documentation.`

  React.useEffect(() => {
    const hasDescription = document.getElementById(contentRef.current?.getAttribute('aria-describedby') ?? '')
    if (!hasDescription) console.warn(MESSAGE)
  }, [MESSAGE, contentRef])

  return null
}
