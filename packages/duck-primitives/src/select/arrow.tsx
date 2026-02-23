import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { type ScopedProps, usePopperScope, useSelectContentContext, useSelectContext } from './select'

const ARROW_NAME = 'SelectArrow'

type SelectArrowElement = React.ComponentRef<typeof PopperPrimitive.Arrow>

export interface SelectArrowProps extends React.ComponentPropsWithRef<typeof PopperPrimitive.Arrow> {}

export const SelectArrow = React.forwardRef<SelectArrowElement, SelectArrowProps>(
  (props: ScopedProps<SelectArrowProps>, forwardedRef) => {
    const { __scopeSelect, ...arrowProps } = props
    const popperScope = usePopperScope(__scopeSelect)
    const context = useSelectContext(ARROW_NAME, __scopeSelect)
    const contentContext = useSelectContentContext(ARROW_NAME, __scopeSelect)
    return context.open && contentContext.position === 'popper' ? (
      <PopperPrimitive.Arrow {...popperScope} {...arrowProps} ref={forwardedRef} />
    ) : null
  },
)

SelectArrow.displayName = ARROW_NAME
