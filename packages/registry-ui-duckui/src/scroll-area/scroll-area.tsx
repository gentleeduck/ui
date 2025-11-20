import { cn } from '@gentleduck/libs/cn'
import type * as React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string
}

const ScrollArea = ({ children, className, viewportClassName, style, ...props }: ScrollAreaProps) => {
  return (
    <div className={cn('relative overflow-hidden', className)} style={style} {...props} data-slot="scroll-area">
      <div className={cn('scrollbar-none h-full w-full overflow-auto', viewportClassName)}>{children}</div>
    </div>
  )
}

export { ScrollArea }
