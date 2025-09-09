import { Placement } from '@floating-ui/react'
import { useTooltip } from './tooltip.hooks'

export interface TooltipOptions {
  placement?: Placement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  skipDelayDuration?: number
  delayDuration?: number
  defaultOpen?: boolean
  mainAxis?: boolean
  modal?: boolean
  alignOffset?: number
  sideOffset?: number
}

export type ContextType = ReturnType<typeof useTooltip> | null
