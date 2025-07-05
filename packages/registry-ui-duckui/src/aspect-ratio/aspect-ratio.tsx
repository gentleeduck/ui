'use client'

import { Slot } from '@gentleduck/aria-feather/slot'

export interface AspectRatioProps extends React.HTMLProps<HTMLDivElement> {
  ratio: number | string
}

function AspectRatio({ children, style, ratio, ...props }: AspectRatioProps) {
  return (
    <Slot
      className={'relative h-auto w-full overflow-hidden'}
      style={{
        aspectRatio: `${ratio}`,
        ...style,
      }}
      {...props}>
      {children}
    </Slot>
  )
}

export { AspectRatio }
