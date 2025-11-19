import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string
}

const ScrollArea = ({ children, className, viewportClassName, style, ...props }: ScrollAreaProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const viewportRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      ref={containerRef}
      style={style}
      {...props}
      data-slot="scroll-area">
      <div className={cn('scrollbar-none h-full w-full overflow-auto', viewportClassName)} ref={viewportRef}>
        {children}
      </div>
    </div>
  )
}

export { ScrollArea }
