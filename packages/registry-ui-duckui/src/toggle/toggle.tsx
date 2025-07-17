'use client'

import type * as React from 'react'

import { toggleVariants } from './toggle.constants'
import type { VariantProps } from '@gentleduck/variants'
import { cn } from '@gentleduck/libs/cn'

function Toggle({
  className,
  variant,
  value,
  ref,
  children,
  ...props
}: Omit<React.HTMLProps<HTMLInputElement>, 'size'> & Omit<VariantProps<typeof toggleVariants>, 'size'>) {
  return (
    <label className={cn('relative flex items-center justify-center')} duck-toggle="" data-value={value}>
      <input
        type="checkbox"
        ref={ref}
        value={value}
        className={cn(toggleVariants({ variant, className }), 'appearance-none checked:bg-muted')}
        {...props}
      />
      <span className={cn('pointer-events-none absolute isolate z-1 select-none')}>{children}</span>
    </label>
  )
}

export { Toggle }
