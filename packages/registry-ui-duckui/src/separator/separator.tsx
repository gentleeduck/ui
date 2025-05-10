'use client'

import * as React from 'react'

import { cn } from '@gentleduck/libs/cn'

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

interface HrProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string
  y?: boolean
  x?: boolean
}

const Separator = ({ className, orientation = 'horizontal', ...props }: SeparatorProps) => (
  <hr
    className={cn(
      'border-border border',
      orientation === 'horizontal' ? 'w-full border-x' : 'h-full border-y',
      className,
    )}
    {...props}
  />
)

const Hr = ({ className, y = false, x = false, ...props }: HrProps) => (
  <hr
    className={cn(
      'border-border border',
      y ? 'w-full border-y' : 'h-full border-x',
      className,
    )}
    {...props}
  />
)

export { Separator, Hr }
