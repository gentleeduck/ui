import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { Slot } from '@gentleduck/primitives/slot'
import type { VariantProps } from '@gentleduck/variants'
import * as React from 'react'
import { badgeVariants } from './badge.constants'

const Badge = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'size'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }
>(({ className, variant = 'default', size = 'default', border = 'default', asChild = false, dir, ...props }, ref) => {
  const Comp = asChild ? Slot : 'span'
  const direction = useDirection(dir as Direction)

  return (
    <Comp
      ref={ref}
      className={cn(badgeVariants({ border, size, variant }), className)}
      data-slot="badge"
      dir={direction}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge }
