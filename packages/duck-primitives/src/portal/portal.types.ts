import type * as React from 'react'
import type { Primitive } from '../primitive-elements'

export namespace IPortal {
  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

  export interface IProps extends PrimitiveDivProps {
    /** The container element to portal into. Defaults to document.body. */
    container?: Element | DocumentFragment | null | undefined
  }
}
