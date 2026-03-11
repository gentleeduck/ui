import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'

const Kbd = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'kbd'>>(
  ({ className, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <kbd
        className={cn(
          'pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted px-1 font-medium font-sans text-muted-foreground text-xs',
          "[&_svg:not([class*='size-'])]:size-3",
          className,
        )}
        data-slot="kbd"
        dir={direction}
        ref={ref}
        {...props}
      />
    )
  },
)
Kbd.displayName = 'Kbd'

const KbdGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <kbd
        className={cn('inline-flex items-center gap-1', className)}
        data-slot="kbd-group"
        ref={ref as React.Ref<HTMLElement>}
        {...props}
      />
    )
  },
)
KbdGroup.displayName = 'KbdGroup'

export { Kbd, KbdGroup }
