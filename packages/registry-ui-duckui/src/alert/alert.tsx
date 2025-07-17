import type React from 'react'
import type { VariantProps } from '@gentleduck/variants'
import { alertVariants } from './alert.constants'
import { cn } from '@gentleduck/libs/cn'

const Alert = ({
  className,
  variant,
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement> & VariantProps<typeof alertVariants>) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
)

const AlertTitle = ({ className, ref, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
  <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
)

const AlertDescription = ({ className, ref, ...props }: React.HTMLProps<HTMLParagraphElement>) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
)

export { Alert, AlertTitle, AlertDescription }
