import { type Placement } from '@floating-ui/react'

export interface PopoverOptions {
  defaultOpen?: boolean
  placement?: Placement
  modal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  sideOffset?: number
  alignOffset?: number
  matchWidth?: boolean
  enableHover?: boolean
  mainAxis?: boolean
  contextMenu?: boolean
}
