'use client'

import { cn } from '@gentleduck/libs/cn'
import * as TogglePrimitive from '@gentleduck/primitives/toggle'
import type { VariantProps } from '@gentleduck/variants'
import * as React from 'react'
import { toggleVariants } from './toggle.constants'

const Toggle = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <TogglePrimitive.Root
      className={cn(toggleVariants({ className, size, variant }))}
      data-slot="toggle"
      ref={ref}
      {...props}
    />
  )
})
Toggle.displayName = 'Toggle'

export { Toggle }
