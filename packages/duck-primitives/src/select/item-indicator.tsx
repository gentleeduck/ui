import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useSelectContext, useSelectItemContext } from './select'

const ITEM_INDICATOR_NAME = 'SelectItemIndicator'

type SelectItemIndicatorElement = React.ComponentRef<typeof Primitive.span>

export interface ISelectItemIndicatorProps extends React.ComponentPropsWithRef<typeof Primitive.span> {}

export const SelectItemIndicator = React.forwardRef<SelectItemIndicatorElement, ScopedProps<ISelectItemIndicatorProps>>(
  (props, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props
    const context = useSelectContext(ITEM_INDICATOR_NAME, __scopeSelect)
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect)
    return itemContext.isSelected ? (
      <Primitive.span
        data-slot="select-item-indicator"
        aria-hidden
        dir={context.dir}
        {...itemIndicatorProps}
        ref={forwardedRef}
      />
    ) : null
  },
)

SelectItemIndicator.displayName = ITEM_INDICATOR_NAME
