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
}: Omit<React.HTMLProps<HTMLLabelElement>, 'size'> & VariantProps<typeof toggleVariants>) {
  return (
    <label
      className={cn(toggleVariants({ className, size, variant }), '')}
      data-value={value}
      duck-toggle=""
      {...props}
      ref={ref}>
      <input className="invisible absolute hidden" disabled={disabled} type="checkbox" value={value} />

      {children}
    </label>
  )
}

export { Toggle }
