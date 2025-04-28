'use client'

import * as React from 'react'

import { cn } from '@gentleduck/libs/cn'

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

const Separator = ({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) => (
  <hr
    className={cn(
      'border-border border',
      orientation === 'horizontal' ? 'w-full border-x' : 'h-full border-y',
      className,
    )}
    {...props}
  />
)
export { Separator }
