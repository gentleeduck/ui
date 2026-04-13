import * as React from 'react'
import { Presence } from '../presence'
import { Primitive } from '../primitive-elements'
import { useRadioGroupItemContext } from './item'
import type { ScopedProps } from './radio-group'

const INDICATOR_NAME = 'RadioGroupIndicator'

type RadioGroupIndicatorElement = React.ComponentRef<typeof Primitive.span>
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>

interface IRadioGroupIndicatorProps extends PrimitiveSpanProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const RadioGroupIndicator = React.forwardRef<RadioGroupIndicatorElement, IRadioGroupIndicatorProps>(
  (props: ScopedProps<IRadioGroupIndicatorProps>, forwardedRef) => {
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

export type { IRadioGroupIndicatorProps }
export { RadioGroupIndicator }
