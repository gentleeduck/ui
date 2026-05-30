import { hideOthers } from 'aria-hidden'
import * as React from 'react'
import { DismissableLayer } from '../dismissable-layer'
import { FocusScope } from '../focus-scope'
import { useFocusGuards } from '../hooks/use-focus-guard'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Presence } from '../presence'
import { getState, useDialogContext } from './dialog'
import type { IDialog } from './dialog.types'
import { usePortalContext } from './portal'
import { DescriptionWarning, TitleWarning } from './warnings'

const CONTENT_NAME = 'DialogContent'

type DialogContentImplElement = React.ComponentRef<typeof DismissableLayer>

export const DialogContent = React.forwardRef<DialogContentImplElement, IDialog.IContentProps>(
  (props: IDialog.IScoped<IDialog.IContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog)
    const { forceMount = portalContext.forceMount, ...contentProps } = props
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog)
    return (
      <Presence present={forceMount || context.open}>
        {context.modal ? (
          <DialogContentModal {...contentProps} ref={forwardedRef} />
        ) : (
          <DialogContentNonModal {...contentProps} ref={forwardedRef} />
        )}
      </Presence>
    )
  },
)

DialogContent.displayName = CONTENT_NAME

const DialogContentModal = React.forwardRef<DialogContentImplElement, IDialog.IContentTypeProps>(
  (props: IDialog.IScoped<IDialog.IContentTypeProps>, forwardedRef) => {
    const {
      trapFocus: trapFocusProp,
      disableOutsidePointerEvents: disableOutsidePointerEventsProp,
      ...restProps
    } = props
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog)
    const contentRef = React.useRef<HTMLDivElement>(null)
    // Track via state so the aria-hide effect retries if Presence delays mount past
    // the first commit (refs are not reactive; the empty-deps version silently no-oped).
    const [content, setContent] = React.useState<HTMLDivElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef, (node) => setContent(node))

    React.useEffect(() => {
      if (content) return hideOthers(content)
    }, [content])

    return (
      <DialogContentImpl
        {...restProps}
        ref={composedRefs}
        trapFocus={trapFocusProp ?? context.open}
        disableOutsidePointerEvents={disableOutsidePointerEventsProp ?? context.open}
        onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.preventDefault()
          context.triggerRef.current?.focus()
        })}
        onPointerDownOutside={composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick
          if (isRightClick) event.preventDefault()
        })}
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault())}
      />
    )
  },
)

DialogContentModal.displayName = 'DialogContentModal'

const DialogContentNonModal = React.forwardRef<DialogContentImplElement, IDialog.IContentTypeProps>(
  (props: IDialog.IScoped<IDialog.IContentTypeProps>, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog)
    const hasInteractedOutsideRef = React.useRef(false)
    const hasPointerDownOutsideRef = React.useRef(false)

    return (
      <DialogContentImpl
        {...props}
        ref={forwardedRef}
        trapFocus={false}
        disableOutsidePointerEvents={false}
        onCloseAutoFocus={(event) => {
          props.onCloseAutoFocus?.(event)
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus()
            event.preventDefault()
          }
          hasInteractedOutsideRef.current = false
          hasPointerDownOutsideRef.current = false
        }}
        onInteractOutside={(event) => {
          props.onInteractOutside?.(event)
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true
            if (event.detail.originalEvent.type === 'pointerdown') {
              hasPointerDownOutsideRef.current = true
            }
          }
          const target = event.target as HTMLElement
          const targetIsTrigger = context.triggerRef.current?.contains(target)
          if (targetIsTrigger) event.preventDefault()
          if (event.detail.originalEvent.type === 'focusin' && hasPointerDownOutsideRef.current) {
            event.preventDefault()
          }
        }}
      />
    )
  },
)

DialogContentNonModal.displayName = 'DialogContentNonModal'

const DialogContentImpl = React.forwardRef<DialogContentImplElement, IDialog.IContentImplProps>(
  (props: IDialog.IScoped<IDialog.IContentImplProps>, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props
    const context = useDialogContext(CONTENT_NAME, __scopeDialog)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)

    useFocusGuards()

    return (
      <>
        <FocusScope
          asChild
          loop
          trapped={trapFocus}
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={onCloseAutoFocus}>
          <DismissableLayer
            data-slot="dialog-content"
            role="dialog"
            id={context.contentId}
            aria-describedby={context.descriptionId}
            aria-labelledby={context.titleId}
            data-state={getState(context.open)}
            dir={context.dir}
            {...contentProps}
            ref={composedRefs}
            onDismiss={() => context.onOpenChange(false)}
          />
        </FocusScope>
        {process.env.NODE_ENV !== 'production' && (
          <>
            <TitleWarning titleId={context.titleId} />
            <DescriptionWarning contentRef={contentRef} descriptionId={context.descriptionId} />
          </>
        )}
      </>
    )
  },
)
DialogContentImpl.displayName = 'DialogContentImpl'
