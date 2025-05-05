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


export interface UseDrawerDragProps {
  ref: React.RefObject<HTMLDialogElement>
  onOpenChange?: (open: boolean) => void
  holdUpThreshold?: number
}

export interface UseDrawerDragReturn {
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void
  handleTouchEnd: () => void
}
