'use client'

import { Slot } from '@gentleduck/duck-primitives/slot'
import { cn } from '@gentleduck/libs/cn'

function AspectRatio({
  style,
  className,
  ratio,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  ratio: string
}) {
  return (
    <Slot
      className={cn('relative h-auto w-full overflow-hidden', className)}
      style={{
        aspectRatio: ratio,
        ...style,
      }}
      {...props}
    />
  )
}

export { AspectRatio }
