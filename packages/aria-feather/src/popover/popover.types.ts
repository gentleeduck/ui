import { type AnimPopoverVariants } from '@gentleduck/motion/anim'
import { VariantProps } from '@gentleduck/variants'
import { DialogContentProps, DialogContextType, DialogProps } from '../dialog/dialog.types'

export interface PopoverProps
  extends Omit<DialogProps, 'id' | 'closeButton' | 'triggerRef' | 'contentRef' | 'children'> {
  /** Time in ms to delay closing the popover after trigger blur or mouse leave. */
  skipDelayDuration: number
  /** Time in ms to delay opening the popover after trigger focus or mouse enter. */
  delayDuration: number
  /** If true, the popover opens when the mouse enters the trigger or wrapper area. */
  mouseEnter: boolean
  /** If true, the popover closes when the mouse leaves the trigger or wrapper area. */
  mouseExist: boolean
  /** If true, the popover is modal. */
  modal: boolean
}

export interface PopoverContentProps extends Partial<DialogContentProps>, VariantProps<typeof AnimPopoverVariants> {
  /** Offset in pixels to adjust alignment relative to the trigger. */
  alignOffset?: number
  /** Offset in pixels to adjust spacing between trigger and content side. */
  sideOffset?: number
}

export interface PopoverContextType extends DialogContextType, Pick<PopoverProps, 'modal'> {
  /** If true, the popover opens when the mouse enters the trigger or wrapper area. */
  mouseEnter: boolean
  /** If true, the popover closes when the mouse leaves the trigger or wrapper area. */
  mouseExist: boolean
}

export interface PopoverRootProps
  extends React.HtmlHTMLAttributes<HTMLDivElement>,
    Partial<Omit<PopoverProps, 'wrapperRef' | 'triggerRef' | 'contentRef' | 'id'>>,
    Pick<DialogProps, 'closeButton'> {
  /** React children to be rendered inside the popover root. */
  children?: React.ReactNode
}
