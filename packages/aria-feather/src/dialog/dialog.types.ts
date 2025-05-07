export interface DialogContextType {
  open: boolean
  ref: React.RefObject<HTMLDialogElement | null>
  onOpenChange: (open: boolean) => void
}

export type DialogProps = {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface UseDrawerDragProps {
  ref: React.RefObject<HTMLDialogElement>
  holdUpThreshold?: number
  onOpenChange?: (open: boolean) => void
}

export interface UseDrawerDragReturn {
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void
}
