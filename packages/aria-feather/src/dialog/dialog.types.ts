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
