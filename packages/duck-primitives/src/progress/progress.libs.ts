const DEFAULT_MAX = 100

type ProgressState = 'indeterminate' | 'complete' | 'loading'

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
  return isNumber(max) && !Number.isNaN(max) && max > 0
}

function isValidValueNumber(value: unknown, max: number): value is number {
  return isNumber(value) && !Number.isNaN(value) && value <= max && value >= 0
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

export type { ProgressState }
export {
  DEFAULT_MAX,
  defaultGetValueLabel,
  getInvalidMaxError,
  getInvalidValueError,
  getProgressState,
  isNumber,
  isValidMaxNumber,
  isValidValueNumber,
}
