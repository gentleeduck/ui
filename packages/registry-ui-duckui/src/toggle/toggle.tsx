'use client'

import { cn } from '@gentleduck/libs/cn'
import type { VariantProps } from '@gentleduck/variants'
import * as React from 'react'
import { toggleVariants } from './toggle.constants'

const Toggle = React.forwardRef<
  HTMLInputElement,
  Omit<Omit<React.HTMLProps<HTMLInputElement>, 'size'>, 'ref'> & VariantProps<typeof toggleVariants>
>(({ className, value, variant = 'default', size = 'default', disabled = false, children, ...props }, ref) => {
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
})
Toggle.displayName = 'Toggle'

export { Toggle }
