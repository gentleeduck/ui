export interface DialogContextType {
  open: boolean
  ref: React.RefObject<HTMLDialogElement | null>
  onOpenChange: (open: boolean) => void
}

export type DialogProps = {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
