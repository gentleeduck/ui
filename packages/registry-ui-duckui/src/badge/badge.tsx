import { cn } from '@gentleduck/libs/cn'
import { Slot } from '@gentleduck/primitives/slot'
import type { VariantProps } from '@gentleduck/variants'
import type * as React from 'react'
import { badgeVariants } from './badge.constants'

const Badge = ({
  className,
  variant = 'default',
  size = 'default',
  border = 'default',
  ref,
  asChild = false,
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, 'size'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : 'span'

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant, size, border }), className)} {...props} />
}

export { Badge }
