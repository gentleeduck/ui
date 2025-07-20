import type { Placement } from '@gentleduck/duck-float/dom'

export type PopoverContentProps = React.HTMLProps<HTMLDivElement> & {
  matchWidth?: boolean
  withArrow?: boolean
  sideOffset?: number
  alignOffset?: number
  placement?: Placement
  renderOnce?: boolean
  rerender?: boolean
}

export type PopoverContextType = {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
  arrowRef: React.RefObject<HTMLDivElement>
  wrapperRef: React.RefObject<HTMLDivElement>
  contentRef: React.RefObject<HTMLDivElement>
  triggerRef: React.RefObject<HTMLElement>
}
