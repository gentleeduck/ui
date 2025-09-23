'use client'

import { cn } from '@gentleduck/libs/cn'
import type * as React from 'react'

const Separator = ({
  className,
  orientation = 'horizontal',
  ref,
  ...props
}: React.HTMLProps<HTMLHRElement> & {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}) => (
  <hr
    aria-orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'min-h-full w-[1px]',
      className,
    )}
    ref={ref}
    {...props}
    data-slot="separator"
  />
)

export { Separator }
