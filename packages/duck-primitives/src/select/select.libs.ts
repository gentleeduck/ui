// Re-export shared typeahead utilities from the common libs location.
export { findNextItem, useTypeaheadListNavigation, useTypeaheadSearch, wrapArray } from '../libs/list-navigation'

export function shouldShowPlaceholder(value?: string) {
  return value === '' || value === undefined
}
