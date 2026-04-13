import * as React from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { Presence } from '../presence'
import { Primitive } from '../primitive-elements'
import { createSlot } from '../slot'
import { getState, type ScopedProps, useDialogContext } from './dialog'
import { usePortalContext } from './portal'

const OVERLAY_NAME = 'DialogOverlay'

type DialogOverlayImplElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface IDialogOverlayImplProps extends PrimitiveDivProps {
  /** Override whether scroll is locked. Defaults to `context.open`. */
  lockScroll?: boolean
}

type DialogOverlayElement = DialogOverlayImplElement
export interface IDialogOverlayProps extends IDialogOverlayImplProps {
  /** Force mounting for animation control. */
  forceMount?: true
}

/** Renders an overlay behind the dialog content. Only renders in modal mode. */
export const DialogOverlay = React.forwardRef<DialogOverlayElement, IDialogOverlayProps>(
  (props: ScopedProps<IDialogOverlayProps>, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog)
    const { forceMount = portalContext.forceMount, ...overlayProps } = props
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog)
    return context.modal ? (
      <Presence present={forceMount || context.open}>
        <DialogOverlayImpl {...overlayProps} ref={forwardedRef} />
      </Presence>
    ) : null
  },
)

DialogOverlay.displayName = OVERLAY_NAME

const Slot = createSlot('DialogOverlay.RemoveScroll')

const DialogOverlayImpl = React.forwardRef<DialogOverlayImplElement, IDialogOverlayImplProps>(
  (props: ScopedProps<IDialogOverlayImplProps>, forwardedRef) => {
    const { __scopeDialog, lockScroll: lockScrollProp, ...overlayProps } = props
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog)
    return (
      <RemoveScroll as={Slot} allowPinchZoom enabled={lockScrollProp ?? context.open} shards={[context.contentRef]}>
        <Primitive.div
          data-slot="dialog-overlay"
          data-state={getState(context.open)}
          dir={context.dir}
          {...overlayProps}
          ref={forwardedRef}
          style={{ pointerEvents: 'auto', ...overlayProps.style }}
        />
      </RemoveScroll>
    )
  },
)
DialogOverlayImpl.displayName = 'DialogOverlayImpl'
