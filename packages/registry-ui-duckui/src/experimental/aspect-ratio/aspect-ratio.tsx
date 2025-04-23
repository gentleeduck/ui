'use client'

import { Slot } from '../../button'

export interface AspectRatioProps extends React.HTMLProps<HTMLDivElement> {
  ratio: number | string
}

function AspectRatio({
  children,
  style,
  ratio,
  ...props
}: AspectRatioProps) {
  return (
    <Slot
      className={'relative overflow-hidden h-auto w-full'}
      style={{
        aspectRatio: `${ratio}`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Slot>
  )
}

export { AspectRatio }
