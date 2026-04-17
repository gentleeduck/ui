import type * as React from 'react'
import type { Primitive } from '../primitive-elements'

export namespace IDismissableLayer {
  export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
  export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

  export interface IProps extends PrimitiveDivProps {
    disableOutsidePointerEvents?: boolean
    onEscapeKeyDown?: (event: KeyboardEvent) => void
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
    onFocusOutside?: (event: FocusOutsideEvent) => void
    onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
    onDismiss?: () => void
  }

  export interface IBranchProps extends PrimitiveDivProps {}
}
