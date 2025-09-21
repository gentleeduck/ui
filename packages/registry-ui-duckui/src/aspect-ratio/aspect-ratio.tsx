'use client'

import { cn } from '@gentleduck/libs/cn'
import { Slot } from '@gentleduck/primitives/slot'

function AspectRatio({
  style,
  className,
  ratio,
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  ratio: string
}) {
  return (
    <Slot
      className={cn('relative h-auto w-full overflow-hidden', className)}
      ref={ref}
      style={{
        aspectRatio: ratio,
        ...style,
      }}
      {...props}
    />
  )
}

export { AspectRatio }
