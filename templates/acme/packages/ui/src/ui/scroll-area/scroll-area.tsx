import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string
  viewportRef?: React.Ref<HTMLDivElement>
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className, viewportClassName, viewportRef, style, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <div
        className={cn('relative overflow-hidden', className)}
        dir={direction}
        style={style}
        ref={ref}
        {...props}
        data-slot="scroll-area">
        <div ref={viewportRef} className={cn('scrollbar-none h-full w-full overflow-auto', viewportClassName)}>
          {children}
        </div>
      </div>
    )
  },
)
ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
