'use client'

import * as React from 'react'

import { cn } from '@gentelduck/libs/cn'

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Separator = (
  (
    { className, orientation = 'horizontal', ...props }: SeparatorProps,

  ) => (
    <hr
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
)
export { Separator }
