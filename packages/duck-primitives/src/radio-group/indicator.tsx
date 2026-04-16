import * as React from 'react'
import { Presence } from '../presence'
import { Primitive } from '../primitive-elements'
import { useRadioGroupItemContext } from './item'
import type { IRadioGroup } from './radio-group.types'

const INDICATOR_NAME = 'RadioGroupIndicator'

type RadioGroupIndicatorElement = React.ComponentRef<typeof Primitive.span>

const RadioGroupIndicator = React.forwardRef<RadioGroupIndicatorElement, IRadioGroup.IIndicatorProps>(
  (props: IRadioGroup.IScoped<IRadioGroup.IIndicatorProps>, forwardedRef) => {
    const { __scopeRadioGroup, forceMount, ...indicatorProps } = props
    const itemContext = useRadioGroupItemContext(INDICATOR_NAME, __scopeRadioGroup)

    return (
      <Presence present={forceMount || itemContext.checked}>
        <Primitive.span
          data-slot="radio-group-indicator"
          data-state={itemContext.checked ? 'checked' : 'unchecked'}
          data-disabled={itemContext.disabled ? '' : undefined}
          {...indicatorProps}
          ref={forwardedRef}
        />
      </Presence>
    )
  },
)

RadioGroupIndicator.displayName = INDICATOR_NAME

export { RadioGroupIndicator }
