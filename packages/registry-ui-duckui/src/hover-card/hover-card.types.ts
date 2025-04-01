import { VariantProps } from 'class-variance-authority'
import { Button } from '../button'
import { hoverCardVariants } from './hover-card.constants'

export interface HoverCardProps extends React.HTMLProps<HTMLDivElement> {
  delayDuration?: number
  sideOffset?: number
  open?: boolean
}

export interface HoverCardTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Button> {}

export interface HoverCardContentProps
  extends React.HTMLProps<HTMLDivElement>,
    VariantProps<typeof hoverCardVariants> {
  /** Determines whether an arrow should be rendered on the tooltip to point at the trigger element.*/
  showArrow?: boolean
}
