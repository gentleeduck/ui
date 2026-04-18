import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { IArrow } from './arrow.types'

const NAME = 'Arrow'

type ArrowElement = React.ComponentRef<typeof Primitive.svg>

const Arrow = React.forwardRef<ArrowElement, IArrow.IProps>((props, forwardedRef) => {
  const { children, width = 10, height = 5, ...arrowProps } = props
  return (
    <Primitive.svg
      data-slot="arrow"
      {...arrowProps}
      ref={forwardedRef}
      width={width}
      height={height}
      viewBox="0 0 30 10"
      preserveAspectRatio="none">
      {props.asChild ? children : <polygon points="0,0 30,0 15,10" />}
    </Primitive.svg>
  )
})

Arrow.displayName = NAME

export { Arrow }
