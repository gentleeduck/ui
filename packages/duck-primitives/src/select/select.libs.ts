export { findNextItem, useTypeaheadListNavigation, useTypeaheadSearch, wrapArray } from '../libs/list-navigation'

export function shouldShowPlaceholder(value?: string) {
  return value === '' || value === undefined
}
