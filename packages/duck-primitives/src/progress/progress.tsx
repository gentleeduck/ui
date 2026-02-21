/** Root Progress component with scope, context, and validation. */
import * as React from 'react'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'

const PROGRESS_NAME = 'Progress'
const DEFAULT_MAX = 100

type ScopedProps<P> = P & { __scopeProgress?: Scope }
const [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME)

type ProgressState = 'indeterminate' | 'complete' | 'loading'
type ProgressContextValue = { value: number | null; max: number }
const [ProgressProvider, useProgressContext] = createProgressContext<ProgressContextValue>(PROGRESS_NAME)

type ProgressElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface ProgressProps extends PrimitiveDivProps {
  value?: number | null | undefined
  max?: number
  getValueLabel?(value: number, max: number): string
}

const Progress = React.forwardRef<ProgressElement, ProgressProps>((props: ScopedProps<ProgressProps>, forwardedRef) => {
  const {
    __scopeProgress,
    value: valueProp = null,
    max: maxProp,
    getValueLabel = defaultGetValueLabel,
    ...progressProps
  } = props

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
    <ProgressProvider scope={__scopeProgress} value={value} max={max}>
      <Primitive.div
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={isNumber(value) ? value : undefined}
        aria-valuetext={valueLabel}
        role="progressbar"
        data-state={getProgressState(value, max)}
        data-value={value ?? undefined}
        data-max={max}
        {...progressProps}
        ref={forwardedRef}
      />
    </ProgressProvider>
  )
})

Progress.displayName = PROGRESS_NAME

function defaultGetValueLabel(value: number, max: number) {
  return `${Math.round((value / max) * 100)}%`
}

function getProgressState(value: number | undefined | null, maxValue: number): ProgressState {
  return value == null ? 'indeterminate' : value === maxValue ? 'complete' : 'loading'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

function isValidMaxNumber(max: unknown): max is number {
  return isNumber(max) && !isNaN(max) && max > 0
}

function isValidValueNumber(value: unknown, max: number): value is number {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0
}

function getInvalidMaxError(propValue: string, componentName: string) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`
}

function getInvalidValueError(propValue: string, componentName: string) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`
}

export { PROGRESS_NAME, createProgressScope, ProgressProvider, useProgressContext, getProgressState, Progress }
export type { ScopedProps, ProgressProps, ProgressContextValue }
