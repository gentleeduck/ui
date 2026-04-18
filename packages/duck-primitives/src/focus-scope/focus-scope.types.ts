import type * as React from 'react'
import type { Primitive } from '../primitive-elements'

export namespace IFocusScope {
  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

  export interface IProps extends PrimitiveDivProps {
    loop?: boolean | undefined
    trapped?: boolean | undefined
    onMountAutoFocus?: ((event: Event) => void) | undefined
    onUnmountAutoFocus?: ((event: Event) => void) | undefined
  }
}
