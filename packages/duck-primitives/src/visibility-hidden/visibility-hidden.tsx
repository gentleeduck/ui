import * as React from 'react'
import { Primitive } from '../primitive-elements'

const NAME = 'VisuallyHidden'

type VisuallyHiddenElement = React.ComponentRef<typeof Primitive.span>
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>
interface IVisuallyHiddenProps extends PrimitiveSpanProps {}

const VisuallyHidden = React.forwardRef<VisuallyHiddenElement, IVisuallyHiddenProps>((props, forwardedRef) => {
  return (
    <Primitive.span
      data-slot="visually-hidden"
      {...props}
      ref={forwardedRef}
      style={{
        position: 'absolute',
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
        ...props.style,
      }}
    />
  )
})

VisuallyHidden.displayName = NAME

const Root = VisuallyHidden

export type { IVisuallyHiddenProps }
export { Root, VisuallyHidden }
