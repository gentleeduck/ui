'use client'

import { cn } from '@gentleduck/libs/cn'
import { Slot } from '@gentleduck/primitives/slot'

function AspectRatio({
  style,
  className,
  ratio,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof Slot> & {
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
      data-slot="aspect-ratio"
    />
  )
}

export { AspectRatio }
