import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { type ScopedProps, usePopperScope, useSelectContentContext, useSelectContext } from './select'

const ARROW_NAME = 'SelectArrow'

type SelectArrowElement = React.ComponentRef<typeof PopperPrimitive.Arrow>

export interface ISelectArrowProps extends React.ComponentPropsWithRef<typeof PopperPrimitive.Arrow> {}

export const SelectArrow = React.forwardRef<SelectArrowElement, ISelectArrowProps>(
  (props: ScopedProps<ISelectArrowProps>, forwardedRef) => {
    const { __scopeSelect, ...arrowProps } = props
    const popperScope = usePopperScope(__scopeSelect)
    const context = useSelectContext(ARROW_NAME, __scopeSelect)
    const contentContext = useSelectContentContext(ARROW_NAME, __scopeSelect)
    return context.open && contentContext.position === 'popper' ? (
      <PopperPrimitive.Arrow data-slot="select-arrow" {...popperScope} {...arrowProps} ref={forwardedRef} />
    ) : null
  },
)

SelectArrow.displayName = ARROW_NAME
