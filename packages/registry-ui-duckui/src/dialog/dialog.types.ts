import type { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import type { VariantProps } from '@gentleduck/variants'
import type {
  Dialog,
  DialogClose,
  DialogCloseProps,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog'
import type { DialogFooter, DialogHeader } from './dialog'

export interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
  ref: React.RefObject<HTMLDialogElement | null>
}

export type DialogProps = {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface DialogContentProps
  extends React.HTMLProps<HTMLDialogElement>,
    VariantProps<typeof AnimVariants>,
    VariantProps<typeof AnimDialogVariants> {
  renderOnce?: boolean
  sideOffset?: number
  closedby?: 'any' | 'closerequest' | 'none'
}

/**
 * DialogResponsiveProps
 */
export interface DialogResponsiveProps extends React.ComponentPropsWithoutRef<typeof Dialog> {}

/**
 * DialogTriggerResponsiveProps
 */
export interface DialogTriggerResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogTrigger> {}

/**
 * DialogContentResponsiveProps
 */
export interface DialogContentResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {}

/**
 * DialogHeaderResponsiveProps
 */
export interface DialogHeaderResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogHeader> {}

/**
 * DialogFooterResponsiveProps
 */
export interface DialogFooterResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogFooter> {}

/**
 * DialogTitleResponsiveProps
 */
export interface DialogTitleResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogTitle> {}

/**
 * DialogDescriptionResponsiveProps
 */
export interface DialogDescriptionResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogDescription> {}

/**
 * DialogCloseResponsiveProps
 */
export interface DialogCloseResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogClose> {}
