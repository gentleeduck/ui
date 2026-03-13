import { cn } from '@gentleduck/libs/cn'
import { Slot } from '@gentleduck/primitives/slot'
import type { VariantProps } from '@gentleduck/variants'
import * as React from 'react'
import { badgeVariants } from './badge.constants'

const Badge = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'size'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }
>(({ className, variant = 'default', size = 'default', border = 'default', asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp ref={ref} className={cn(badgeVariants({ border, size, variant }), className)} data-slot="badge" {...props} />
  )
})
Badge.displayName = 'Badge'

export { Badge }
