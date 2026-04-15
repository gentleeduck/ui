import * as React from 'react'
import { Primitive } from '../primitive-elements'

const NAME = 'Arrow'

type ArrowElement = React.ComponentRef<typeof Primitive.svg>
type IArrowProps = React.ComponentPropsWithoutRef<typeof Primitive.svg>

const Arrow = React.forwardRef<ArrowElement, IArrowProps>((props, forwardedRef) => {
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

export type { IArrowProps }
export { Arrow }
