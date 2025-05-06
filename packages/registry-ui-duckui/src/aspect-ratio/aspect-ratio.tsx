'use client'

import { cn } from '@gentleduck/libs/cn'

export interface AspectRatioProps extends React.HTMLProps<HTMLDivElement> {
  ratio: number
}
function AspectRatio({ className, children, style, ratio, ...props }: AspectRatioProps) {
  return (
    <div
      className={cn('relative overflow-hidden w-full', className)}
      style={{
        // ensures inner element is contained
        position: 'relative',
        // ensures padding bottom trick maths works
        width: '100%',
        paddingBottom: `${100 / ratio}%`,
        ...style,
      }}
      {...props}>
      {children}
    </div>
  )
}

export { AspectRatio }
