import { DialogCommonType, DialogContentProps } from '../dialog/dialog.types'

export interface PopoverProps extends Omit<DialogCommonType, 'id' | 'closeButton'> {
  hoverable: boolean
  skipDelayDuration: number
  delayDuration: number
  // TODO: remove it from here and fix it in the dialog
  wrapperRef: React.RefObject<HTMLDivElement>
}

export interface PopoverContentProps extends Partial<DialogContentProps> {
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inset'
  align?: 'start' | 'end' | 'center'
  alignOffset?: number
  sideOffset?: number
}

export interface PopoverContextType extends PopoverProps, DialogCommonType {
  wrapperRef: React.RefObject<HTMLDivElement | null>
  triggerRef: React.RefObject<Element | null>
  contentRef: React.RefObject<HTMLDialogElement | null>
}

export interface PopoverRootProps extends Partial<Omit<PopoverProps, 'id'>>, DialogCommonType {
  children?: React.ReactNode
}
