'use client'

import { cn } from '@gentleduck/libs/cn'
import type { VariantProps } from '@gentleduck/variants'
import type * as React from 'react'
import { toggleVariants } from './toggle.constants'

function Toggle({
  className,
  value,
  variant = 'default',
  size = 'default',
  ref,
  disabled = false,
  children,
  ...props
}: Omit<React.HTMLProps<HTMLInputElement>, 'size'> & VariantProps<typeof toggleVariants>) {
  return (
    <label
      className={cn(toggleVariants({ className, size, variant }))}
      data-slot="toggle"
      data-value={value}
      duck-toggle="">
      <input
        className="invisible absolute hidden"
        disabled={disabled}
        ref={ref}
        type="checkbox"
        value={value}
        {...props}
      />

      {children}
    </label>
  )
}

export { Toggle }
