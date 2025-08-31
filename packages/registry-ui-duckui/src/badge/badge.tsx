import { cn } from '@gentleduck/libs/cn'
import type { VariantProps } from '@gentleduck/variants'
import type * as React from 'react'
import { badgeVariants } from './badge.constants'

const Badge = ({
  className,
  variant = 'default',
  size = 'default',
  border = 'default',
  ref,
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, 'size'> & VariantProps<typeof badgeVariants>) => {
  return <div className={cn(badgeVariants({ variant, size, border }), className)} ref={ref} {...props} />
}

export { Badge }
