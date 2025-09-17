import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

const Input = ({ className, type, ref, ...props }: React.HTMLProps<HTMLInputElement>) => {
  return (
    <input
      type={type}
      // aria-invalid="true"
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive md:text-sm',

        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

export { Input }
