import * as React from 'react'
import { useDirection } from '../direction'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import {
  DEFAULT_MAX,
  defaultGetValueLabel,
  getInvalidMaxError,
  getInvalidValueError,
  getProgressState,
  isNumber,
  isValidMaxNumber,
  isValidValueNumber,
} from './progress.libs'
import type { IProgress } from './progress.types'

const PROGRESS_NAME = 'Progress'

const [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME)

const [ProgressProvider, useProgressContext] = createProgressContext<IProgress.IContext>(PROGRESS_NAME)

type ProgressElement = React.ComponentRef<typeof Primitive.div>

const Progress = React.forwardRef<ProgressElement, IProgress.IProps>(
  (props: IProgress.IScoped<IProgress.IProps>, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      dir,
      ...progressProps
    } = props
    const direction = useDirection(dir)

    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, 'Progress'))
    }

    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX

    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, 'Progress'))
    }

    const value = isValidValueNumber(valueProp, max) ? valueProp : null
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : undefined

    return (
      <ProgressProvider scope={__scopeProgress} value={value} max={max} dir={direction}>
        <Primitive.div
          data-slot="progress"
          aria-valuemax={max}
          aria-valuemin={0}
          aria-valuenow={isNumber(value) ? value : undefined}
          aria-valuetext={valueLabel}
          role="progressbar"
          data-state={getProgressState(value, max)}
          data-value={value ?? undefined}
          data-max={max}
          dir={direction}
          {...progressProps}
          ref={forwardedRef}
        />
      </ProgressProvider>
    )
  },
)

Progress.displayName = PROGRESS_NAME

export { createProgressScope, getProgressState, PROGRESS_NAME, Progress, ProgressProvider, useProgressContext }
