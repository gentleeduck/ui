'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

const Separator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement> & {
    orientation?: 'horizontal' | 'vertical'
  }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <hr
    ref={ref}
    aria-orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'min-h-full w-[1px]',
      className,
    )}
    {...props}
    data-slot="separator"
  />
))
Separator.displayName = 'Separator'

export { Separator }
