import type { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import type { VariantProps } from '@gentleduck/variants'
import { MountMinimal } from '~/mount'

export interface DialogContextType {
  /** Ref to the outermost wrapper element of the dialog. */
  wrapperRef: React.RefObject<HTMLDivElement | null>
  /** Ref to the HTML `<dialog>` element containing the content. */
  contentRef: React.RefObject<HTMLDialogElement | null>
  /** Ref to the trigger element (e.g., button or custom element). */
  triggerRef: React.RefObject<HTMLElement | HTMLDivElement | HTMLButtonElement | null>
  /** Controls whether the dialog is open or closed. */
  open?: boolean
  /** Callback triggered when the open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Shows a built-in close button if `true`. */
  closeButton?: boolean
  /** If `true`, the dialog will be rendered as a modal. */
  modal?: boolean
  /** Unique identifier for the dialog. */
  id?: string
  /** If `true`, the scroll position will be locked when the dialog is open. */
  lockScroll?: boolean
}

export interface DialogContentProps
  extends React.HTMLProps<HTMLDialogElement>,
    VariantProps<typeof AnimVariants>,
    VariantProps<typeof AnimDialogVariants>,
    React.ComponentPropsWithoutRef<typeof MountMinimal> {
  /**
   * Determines what can close the dialog:
   * - `'any'`: Clicking outside or pressing escape will close it.
   * - `'closerequest'`: Only a programmatic request (e.g., `onOpenChange(false)`) will close it.
   * - `'none'`: The dialog cannot be closed manually.
   */
  closedby?: 'any' | 'closerequest' | 'none'
  /**
   * A React component that renders a close button.
   * Receives button props and an optional `size`.
   */
  dialogClose: React.FC<
    React.HTMLProps<HTMLButtonElement> & {
      size?: number
    }
  >
}

export interface DialogProps
  extends Pick<DialogContextType, 'open' | 'onOpenChange' | 'wrapperRef' | 'closeButton' | 'lockScroll' | 'modal'> {
  /** Child components including trigger, content, overlays, etc. */
  children?: React.ReactNode
}
