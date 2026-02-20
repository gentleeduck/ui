import * as React from 'react'
import { Primitive } from '../primitive-elements'

/* -------------------------------------------------------------------------------------------------
 * Arrow
 *
 * Renders an SVG arrow (default: downward-pointing triangle).
 * Supports asChild to replace the entire SVG with a custom element.
 * Used by PopperArrow to render the visual arrow indicator.
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Arrow'

type ArrowElement = React.ElementRef<typeof Primitive.svg>
type ArrowProps = React.ComponentPropsWithoutRef<typeof Primitive.svg>

const Arrow = React.forwardRef<ArrowElement, ArrowProps>((props, forwardedRef) => {
  const { children, width = 10, height = 5, ...arrowProps } = props
  return (
    <Primitive.svg
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
export type { ArrowProps }
