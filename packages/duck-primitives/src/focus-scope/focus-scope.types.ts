import type * as React from 'react'
import type { Primitive } from '../primitive-elements'

export namespace IFocusScope {
  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

  export interface IProps extends PrimitiveDivProps {
    loop?: boolean
    trapped?: boolean
    onMountAutoFocus?: (event: Event) => void
    onUnmountAutoFocus?: (event: Event) => void
  }
}
