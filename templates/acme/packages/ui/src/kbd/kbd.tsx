'use client'

import { cn } from '@gentleduck/libs/cn'
import type { IDirection } from '@gentleduck/primitives/direction'
import { useDirection } from '@gentleduck/primitives/direction'
import { formatForDisplay } from '@gentleduck/vim/format'
import * as React from 'react'

interface IKbdProps extends React.ComponentPropsWithoutRef<'kbd'> {
  keys?: string
}

const Kbd = React.forwardRef<HTMLElement, IKbdProps>(({ className, dir, keys, children, ...props }, ref) => {
  const direction = useDirection(dir as IDirection.Kind)
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
      {...props}>
      {children ?? (keys ? formatForDisplay(keys) : null)}
    </kbd>
  )
})
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
