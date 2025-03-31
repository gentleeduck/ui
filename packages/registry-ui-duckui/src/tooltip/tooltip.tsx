'use client'

import * as React from 'react'
import { cn } from '@gentelduck/libs/cn'
import { tooltipVariants, tooltipArrowVariants } from './tooltip.constants'
import type { TooltipContentProps, TooltipProps } from './tooltip.types'

/**
 * Renders a Tooltip component that displays a tooltip on hover or focus.
 *
 * @param {TooltipProps} props - Additional props to pass to the tooltip container.
 * @param {React.ReactNode} [props.children] - The content to be wrapped by the tooltip.
 * @param {number} [props.delayDuration=500] - The delay in milliseconds before the tooltip appears.
 * @param {number} [pros.sideOffset=4] - Offset from the side of the tooltip trigger.
 * @param {string} [pros.size] - Optional size of the tooltip.
 * @param {string} [props.className] - Additional classes to apply to the tooltip.
 * @param {boolean} [props.asChild] - If true, passes the content as a child component.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional props to pass to the tooltip container.
 * @returns {JSX.Element} The rendered tooltip component.
 */

export function Tooltip({
  children,
  delayDuration = 500,
  sideOffset = 4,
  size,
  className,
  asChild,
  ...props
}: TooltipProps): JSX.Element {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 font-regular cursor-pointer',
        'group/tooltip flex w-full'
      )}
      style={
        {
          '--tooltip-delay': `${delayDuration}ms`,
          '--side-offset': `${sideOffset}px`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}

export function TooltipContent({
  position,
  variant,
  className,
  showArrow = false,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <div
      role='tooltip'
      className={cn(tooltipVariants({ variant, position }), className)}
      data-side={position}
      {...props}
    >
      {children}
      {showArrow && (
        <span
          className={cn(tooltipArrowVariants({ position }))}
          aria-hidden='true'
        />
      )}
    </div>
  )
}

Tooltip.displayName = 'Tooltip'
