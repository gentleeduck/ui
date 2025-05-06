'use client'

import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'
import { tooltipVariants, tooltipArrowVariants } from './tooltip.constants'
import type { TooltipContentProps, TooltipProps, TooltipTriggerProps } from './tooltip.types'
import { Button } from '../button'

function Tooltip({
  delayDuration = 500,
  sideOffset = 4,
  open = false,
  className,
  style,
  size,
  ...props
}: TooltipProps) {
  return (
    <div
      data-method={open ? 'forced' : 'hover'}
      className={cn('whitespace-nowrap group/tooltip relative', className)}
      style={
        {
          '--tooltip-delay': `${delayDuration}ms`,
          '--side-offset': `${sideOffset}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

function TooltipTrigger({ ...props }: TooltipTriggerProps): JSX.Element {
  return <Button {...props} />
}

/**
 * Renders the content of a Tooltip component.
 *
 * @param {TooltipContentProps} props - Additional props to pass to the tooltip content.
 * @param {string} [props.position] - The position of the tooltip, either 'top', 'right', 'bottom', or 'left'.
 * @param {string} [props.variant] - Optional variant style for the tooltip content.
 * @param {string} [props.className] - Additional classes to apply to the tooltip content.
 * @param {boolean} [props.showArrow=false] - If true, renders an arrow pointing towards the trigger.
 * @param {React.ReactNode} props.children - The content to be rendered inside the tooltip.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional props to pass to the tooltip content.
 * @returns {JSX.Element} The rendered tooltip content.
 */
function TooltipContent({
  position = 'top',
  variant,
  className,
  showArrow = false,
  children,
  ...props
}: TooltipContentProps): JSX.Element {
  return (
    <div
      role="tooltip"
      className={cn(tooltipVariants({ variant, position }), className)}
      data-side={position}
      {...props}>
      {children}
      {showArrow && <span className={cn(tooltipArrowVariants({ position }))} aria-hidden="true" />}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
