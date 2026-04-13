import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { createSlottable } from '../slot'
import { createAlertDialogContext, type ScopedProps, useDialogScope } from './alert-dialog'

const CONTENT_NAME = 'AlertDialogContent'
const TITLE_NAME = 'AlertDialogTitle'
const DESCRIPTION_NAME = 'AlertDialogDescription'

type AlertDialogCancelElement = React.ComponentRef<typeof DialogPrimitive.Close>

type AlertDialogContentContextValue = {
  cancelRef: React.RefObject<AlertDialogCancelElement | null>
}

export const [AlertDialogContentProvider, useAlertDialogContentContext] =
  createAlertDialogContext<AlertDialogContentContextValue>(CONTENT_NAME)

type AlertDialogContentElement = React.ComponentRef<typeof DialogPrimitive.Content>
type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
export interface IAlertDialogContentProps
  extends Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'> {}

const Slottable = createSlottable('AlertDialogContent')

/** Alert dialog content area with forced modal behavior and accessibility defaults. */
export const AlertDialogContent = React.forwardRef<AlertDialogContentElement, IAlertDialogContentProps>(
  (props: ScopedProps<IAlertDialogContentProps>, forwardedRef) => {
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
            {/**
             * We have to use Slottable here as we cannot wrap the AlertDialogContentProvider
             * around everything, otherwise the DescriptionWarning would be rendered straight away.
             * This is because we want the accessibility checks to run only once the content is actually
             * open and that behaviour is already encapsulated in DialogContent.
             */}
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
