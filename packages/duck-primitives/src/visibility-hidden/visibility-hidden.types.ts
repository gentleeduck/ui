import type * as React from 'react'
import type { Primitive } from '../primitive-elements'

export namespace IVisuallyHidden {
  type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>

  export interface IProps extends PrimitiveSpanProps {}
}
