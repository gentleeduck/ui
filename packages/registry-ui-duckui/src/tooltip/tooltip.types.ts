import { VariantProps } from 'class-variance-authority'
import { tooltipVariants } from './tooltip.constants'

/**
 * Props for the Tooltip component.
 *
 * This interface extends the standard HTML div properties (except for the "content" prop)
 * and adds additional tooltip-specific properties.
 */
export interface TooltipProps extends React.HTMLProps<HTMLButtonElement> {
  /** If true, the tooltip will render its child element directly, inheriting its styles. */
  asChild?: boolean
  /** The delay in milliseconds before the tooltip is shown after hover or focus. */
  delayDuration?: number
  /** The offset distance in pixels between the tooltip and the trigger element. */
  sideOffset?: number
}

/**
 * Props for the TooltipContent component.
 *
 * This interface extends the standard HTML div properties and includes variant properties
 * from the tooltipVariants configuration, allowing for style customization.
 */
export interface TooltipContentProps
  extends React.HTMLProps<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  /** Determines whether an arrow should be rendered on the tooltip to point at the trigger element.*/
  showArrow?: boolean
}
