import * as React from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'
import { BadgeProps } from './badge.types'
import { badgeVariants } from './badge.constants'

import { cn } from '@gentelduck/libs/cn'

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, label, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(badgeVariants({ variant, size }), className)}
            ref={ref}
            {...props}
          />
        </TooltipTrigger>
        {label && size === 'icon' && (
          <TooltipContent>{label.children}</TooltipContent>
        )}
      </Tooltip>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
