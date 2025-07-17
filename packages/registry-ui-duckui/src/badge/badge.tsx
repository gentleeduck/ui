import { cn } from '@gentleduck/libs/cn'
import { VariantProps } from '@gentleduck/variants'
import * as React from 'react'
import { badgeVariants } from './badge.constants'

const Badge = ({
  className,
  variant = 'default',
  size = 'default',
  ref,
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, 'size'> & VariantProps<typeof badgeVariants>) => {
  return <div className={cn(badgeVariants({ variant, size }), className)} ref={ref} {...props} />
}

export { Badge }
