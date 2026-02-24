import { cn } from '@gentleduck/libs/cn'
import { useDirection } from '@gentleduck/primitives/hooks/direction'
import * as React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className, viewportClassName, style, ...props }, ref) => {
    const direction = useDirection((props as { dir?: 'ltr' | 'rtl' }).dir)
    return (
      <div
        className={cn('relative overflow-hidden', className)}
        dir={direction}
        style={style}
        ref={ref}
        {...props}
        data-slot="scroll-area">
        <div className={cn('scrollbar-none h-full w-full overflow-auto', viewportClassName)}>{children}</div>
      </div>
    )
  },
)
ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
