import './csssss.css'
import * as React from 'react'
import { Button } from '~/src/button'
import { Scope } from './create-context'
import { Portal as PortalPrimitive } from './portal'
import { createContext, createContextScope } from './create-context'
import { useControllableState } from './controlled'
import { Presence } from './presence'
import { useFocusGuards } from './guards'
import { FocusScope } from './focus'

import { DismissableLayer } from './dimisable'
import { cn } from '@gentelduck/libs/cn'
// import { composeEventHandlers } from '@radix-ui/primitive'
// import { RemoveScroll } from 'react-remove-scroll'
// import { hideOthers } from 'aria-hidden'

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const DIALOG_NAME = 'Dialog'

type ScopedProps<P> = P & { __scopeDialog?: Scope }
const [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME)

type DialogContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement | null>
  contentRef: React.RefObject<DialogContentTypeElement | null>
  contentId: string
  titleId: string
  descriptionId: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  modal: boolean
}

const [DialogProvider, useDialogContext] =
  createDialogContext<DialogContextValue>(DIALOG_NAME)

interface DialogProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  modal?: boolean
}

const Dialog: React.FC<DialogProps> = (props: ScopedProps<DialogProps>) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true,
  } = props
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<DialogContentTypeElement>(null)
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <DialogProvider
      scope={__scopeDialog}
      triggerRef={triggerRef}
      contentRef={contentRef}
      contentId={React.useId()}
      titleId={React.useId()}
      descriptionId={React.useId()}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(
        () => setOpen((prevOpen) => !prevOpen),
        [setOpen],
      )}
      modal={modal}
    >
      {children}
    </DialogProvider>
  )
}

Dialog.displayName = DIALOG_NAME

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DialogTrigger'

interface DialogTriggerProps
  extends React.ComponentPropsWithRef<typeof Button> {}

const DialogTrigger = ({
  ref,
  ...triggerProps
}: ScopedProps<DialogTriggerProps>) => {
  const context = useDialogContext()
  console.log(context)
  return (
    <Button
      type='button'
      aria-haspopup='dialog'
      aria-expanded={context.open}
      aria-controls={context.contentId}
      data-state={getState(context.open)}
      onClick={() => {
        context.onOpenToggle()
      }}
      {...triggerProps}
      ref={ref}
    />
  )
 
 
 * -------------------------------------------------------------------------------------------------
 * DialogPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'DialogPortal'

type PortalContextValue = { forceMount?: true }
const [PortalProvider, usePortalContext] =
  createDialogContext<PortalContextValue>(PORTAL_NAME, {
    forceMount: undefined,
  })

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>
interface DialogPortalProps {
  children?: React.ReactNode
  /**
   * Specify a container element to portal the content into.
   */
  container?: PortalProps['container']
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
 
 
 onst DialogPortal: React.FC<DialogPortalProps> = (
  props: ScopedProps<DialogPortalProps>,
) => {
  const { __scopeDialog, forceMount, children, container } = props
  const context = useDialogContext(PORTAL_NAME, __scopeDialog)
  return (
    <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
      {React.Children.map(children, (child) => (
        <Presence present={forceMount || context.open}>
          <PortalPrimitive container={container}>{child}</PortalPrimitive>
        </Presence>
      ))}
    </PortalProvider>
  )
}

DialogPortal.displayName = PORTAL_NAME

 * -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/
 
 onst OVERLAY_NAME = 'DialogOverlay'
 
 ype DialogOverlayElement = DialogOverlayImplElement
 nterface DialogOverlayProps extends DialogOverlayImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const DialogOverlay = React.forwardRef<
  DialogOverlayElement,
  DialogOverlayProps
>((props: ScopedProps<DialogOverlayProps>, forwardedRef) => {
  const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog)
  const { forceMount = portalContext.forceMount, ...overlayProps } = props
  const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog)
  return context.modal ? (
    <Presence present={forceMount || context.open}>
      <DialogOverlayImpl {...overlayProps} ref={forwardedRef} />
    </Presence>
  ) : null
 )
 
 ialogOverlay.displayName = OVERLAY_NAME
 
 nterface DialogOverlayImplProps extends React.HTMLProps<HTMLDivElement> {}
 
 onst DialogOverlayImpl = ({
  __scopeDialog,
  ref,
  ...overlayProps
}: ScopedProps<DialogOverlayImplProps>) => {
  const context = useDialogContext(OVERLAY_NAME, __scopeDialog)
  return (
    // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
    // ie. when `Overlay` and `Content` are siblings
    // FIX:
    // <RemoveScroll as={Slot} allowPinchZoom shards={[context.contentRef]}>
    <div
      data-state={getState(context.open)}
      {...overlayProps}
      ref={ref}
      // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling the overlay.
      style={{ pointerEvents: 'auto', ...overlayProps.style }}
    />
    // </RemoveScroll>
  )
 
 
 * -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent'

interface DialogContentProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const DialogContent = ({ ref, ...props }: ScopedProps<DialogContentProps>) => {
  // const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog)
  // const { forceMount = portalContext.forceMount, ref, ...contentProps } = props
  const context = useDialogContext(CONTENT_NAME, props.__scopeDialog)
  console.log(props.__scopeDialog)
   eturn (
    <div
      {...props}
      className='fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg transform -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg sm:rounded-lg sm:max-w-[425px] z-[52] duration-300 ease-out data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[state=closed]:hidden'
      ref={ref}
    />
   
  //   <Presence present={context.open}>
  // </Presence>
}

/* -----------------------------------------------------------------------------------------------*/

type DialogContentTypeElement = DialogContentImplElement
interface DialogContentTypeProps
  extends Omit<
    DialogContentImplProps,
    'trapFocus' | 'disableOutsidePointerEvents'
  > {}

const DialogContentModal = (props: ScopedProps<DialogContentTypeProps>) => {
  const context = useDialogContext(CONTENT_NAME, props.__scopeDialog)
  const contentRef = React.useRef<HTMLDivElement>(null)

  // aria-hide everything except the content (better supported equivalent to setting aria-modal)
  // FIX:
  // React.useEffect(() => {
  //   const content = contentRef.current
  //   if (content) return hideOthers(content)
  // }, [])

  return (
    <DialogContentImpl
      {...props}
      // ref={props.ref ?? context.contentRef ?? contentRef}
      // we make sure focus isn't trapped once `DialogContent` has been closed
      // (closed !== unmounted when animating out)
      // trapFocus={context.open}
      // disableOutsidePointerEvents
      // onCloseAutoFocus={(e) => {
      //   e.preventDefault()
      //   context.triggerRef.current?.focus()
      //   props.onCloseAutoFocus(e)
      // }}
      // onPointerDownOutside={composeEventHandlers(
      //   props.onPointerDownOutside,
      //   (event) => {
      //     const originalEvent = event.detail.originalEvent
      //     const ctrlLeftClick =
      //       originalEvent.button === 0 && originalEvent.ctrlKey === true
      //     const isRightClick = originalEvent.button === 2 || ctrlLeftClick
      //
      //     // If the event is a right-click, we shouldn't close because
      //     // it is effectively as if we right-clicked the `Overlay`.
      //     if (isRightClick) event.preventDefault()
      //   },
      // )}
      // // When focus is trapped, a `focusout` event may still happen.
      // // We make sure we don't trigger our `onDismiss` in such case.
      // onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) =>
      //   event.preventDefault(),
      // )}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

const DialogContentNonModal = (props: ScopedProps<DialogContentTypeProps>) => {
  const context = useDialogContext(CONTENT_NAME, props.__scopeDialog)
  const hasInteractedOutsideRef = React.useRef(false)
  const hasPointerDownOutsideRef = React.useRef(false)

  return (
    <DialogContentImpl
      {...props}
      // ref={props.ref}
      trapFocus={false}
      disableOutsidePointerEvents={false}
      onCloseAutoFocus={(event) => {
        props.onCloseAutoFocus?.(event)

        if (!event.defaultPrevented) {
          if (!hasInteractedOutsideRef.current)
            context.triggerRef.current?.focus()
          // Always prevent auto focus because we either focus manually or want user agent focus
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

        // Prevent dismissing when clicking the trigger.
        // As the trigger is already setup to close, without doing so would
        // cause it to close and immediately open.
        const target = event.target as HTMLElement
        const targetIsTrigger = context.triggerRef.current?.contains(target)
        if (targetIsTrigger) event.preventDefault()

        // On Safari if the trigger is inside a container with tabIndex={0}, when clicked
        // we will get the pointer down outside event on the trigger, but then a subsequent
        // focus outside event on the container, we ignore any focus outside event when we've
        // already had a pointer down outside event.
        if (
          event.detail.originalEvent.type === 'focusin' &&
          hasPointerDownOutsideRef.current
        ) {
          event.preventDefault()
        }
      }}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

type DialogContentImplElement = React.ElementRef<typeof DismissableLayer>
type DismissableLayerProps = React.ComponentPropsWithoutRef<
  typeof DismissableLayer
>
type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>
interface DialogContentImplProps
  extends Omit<DismissableLayerProps, 'onDismiss'> {
  /**
   * When `true`, focus cannot escape the `Content` via keyboard,
   * pointer, or a programmatic focus.
   * @defaultValue false
   */
  trapFocus?: FocusScopeProps['trapped']

  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented.
   */
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']

  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']
}

const DialogContentImpl = (props: ScopedProps<DialogContentImplProps>) => {
  const {
    __scopeDialog,
    trapFocus,
    onOpenAutoFocus,
    onCloseAutoFocus,
    ref,
    ...contentProps
  } = props
  const context = useDialogContext(CONTENT_NAME, __scopeDialog)
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Make sure the whole tree has focus guards as our `Dialog` will be
  // the last element in the DOM (because of the `Portal`)
  // useFocusGuards()

  return (
    <>
      <FocusScope
        asChild
        loop
        trapped={trapFocus}
        onMountAutoFocus={onOpenAutoFocus}
        onUnmountAutoFocus={onCloseAutoFocus}
      >
        <DismissableLayer
          role='dialog'
          id={context.contentId}
          aria-describedby={context.descriptionId}
          aria-labelledby={context.titleId}
          data-state={getState(context.open)}
          {...contentProps}
          ref={ref}
          onDismiss={() => context.onOpenChange(false)}
        />
      </FocusScope>
    </>
  )
}

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose'

interface DialogCloseProps extends React.ComponentPropsWithRef<typeof Button> {}

const DialogClose = ({
  __scopeDialog,
  onClick,
  ref,
  ...closeProps
}: ScopedProps<DialogCloseProps>) => {
  const context = useDialogContext(CLOSE_NAME, __scopeDialog)
  return (
    <Button
      type='button'
      ref={ref}
      onClick={(e) => {
        context.onOpenChange(false)
        onClick?.(e)
      }}
      {...closeProps}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed'
}

const Root = Dialog
const Trigger = DialogTrigger
const Portal = DialogPortal
const Overlay = DialogOverlay
const Content = DialogContent
const Close = DialogClose

export {
  createDialogScope,
  //
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  //
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Close,
}
