import type * as React from 'react'
import type { Primitive } from '../primitive-elements'

export namespace IDismissableLayer {
  export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
  export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

  export interface IProps extends PrimitiveDivProps {
    disableOutsidePointerEvents?: boolean | undefined
    onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined
    onPointerDownOutside?: ((event: PointerDownOutsideEvent) => void) | undefined
    onFocusOutside?: ((event: FocusOutsideEvent) => void) | undefined
    onInteractOutside?: ((event: PointerDownOutsideEvent | FocusOutsideEvent) => void) | undefined
    onDismiss?: (() => void) | undefined
  }

  export interface IBranchProps extends PrimitiveDivProps {}
}
