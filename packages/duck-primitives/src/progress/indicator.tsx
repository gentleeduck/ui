/** ProgressIndicator - visual indicator for progress state. */
import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useProgressContext } from './progress'
import { getProgressState } from './progress.libs'

const INDICATOR_NAME = 'ProgressIndicator'

type ProgressIndicatorElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface IProgressIndicatorProps extends PrimitiveDivProps {}

const ProgressIndicator = React.forwardRef<ProgressIndicatorElement, IProgressIndicatorProps>(
  (props: ScopedProps<IProgressIndicatorProps>, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress)
    return (
      <Primitive.div
        data-slot="progress-indicator"
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

export type { IProgressIndicatorProps }
export { ProgressIndicator }
