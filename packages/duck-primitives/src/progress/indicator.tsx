/** ProgressIndicator - visual indicator for progress state. */
import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { getProgressState, type ScopedProps, useProgressContext } from './progress'

const INDICATOR_NAME = 'ProgressIndicator'

type ProgressIndicatorElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface ProgressIndicatorProps extends PrimitiveDivProps {}

const ProgressIndicator = React.forwardRef<ProgressIndicatorElement, ProgressIndicatorProps>(
  (props: ScopedProps<ProgressIndicatorProps>, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress)
    return (
      <Primitive.div
        data-state={getProgressState(context.value, context.max)}
        data-value={context.value ?? undefined}
        data-max={context.max}
        dir={context.dir}
        {...indicatorProps}
        ref={forwardedRef}
      />
    )
  },
)

ProgressIndicator.displayName = INDICATOR_NAME

export { ProgressIndicator }
export type { ProgressIndicatorProps }
