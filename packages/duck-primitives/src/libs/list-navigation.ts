import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'

export const NAVIGATION_KEYS = ['ArrowUp', 'ArrowDown', 'Home', 'End'] as const
export const SELECTION_KEYS = [' ', 'Enter']

/** Focus first candidate that accepts focus, scrolling into view. */
export function focusFirst(candidates: Array<HTMLElement | null>) {
  const previouslyFocused = document.activeElement
  for (const candidate of candidates) {
    if (candidate === previouslyFocused) return
    candidate?.scrollIntoView({ block: 'nearest' })
    candidate?.focus({ preventScroll: true })
    if (document.activeElement !== previouslyFocused) return
  }
}

/** Ordered arrow-key candidates: reversed for Up/End, sliced past current for Up/Down. */
export function getNavigationCandidates(
  items: HTMLElement[],
  key: string,
  activeElement: Element | null,
): HTMLElement[] {
  let candidates = items.slice()
  if (key === 'ArrowUp' || key === 'End') {
    candidates = candidates.reverse()
  }
  if (key === 'ArrowUp' || key === 'ArrowDown') {
    const currentIndex = candidates.indexOf(activeElement as HTMLElement)
    candidates = candidates.slice(currentIndex + 1)
  }
  return candidates
}

/** `wrapArray(['a','b','c','d'], 2) === ['c','d','a','b']` */
export function wrapArray<T>(array: T[], startIndex: number) {
  // biome-ignore lint/style/noNonNullAssertion: modulo guarantees the index is always within bounds
  return array.map<T>((_, index) => array[(startIndex + index) % array.length]!)
}

/**
 * Find next typeahead match. Repeated chars (e.g. 'aaa') collapse to one char and cycle
 * starting after currentItem; a fresh single char searches from the top of the list.
 */
export function findNextItem<T extends { textValue: string }>(items: T[], search: string, currentItem?: T) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0])
  // biome-ignore lint/style/noNonNullAssertion: search.length > 1 guarantees search[0] exists when isRepeated is true
  const normalizedSearch = isRepeated ? search[0]! : search
  const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1
  const isFreshSingleChar = search.length === 1
  const startIndex = isFreshSingleChar ? 0 : Math.max(currentItemIndex, 0)
  let wrappedItems = wrapArray(items, startIndex)
  const excludeCurrentItem = !isFreshSingleChar && normalizedSearch.length === 1
  if (excludeCurrentItem) wrappedItems = wrappedItems.filter((v) => v !== currentItem)
  const nextItem = wrappedItems.find((item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase()))
  return nextItem !== currentItem ? nextItem : undefined
}

/**
 * Typeahead search with 1s auto-reset. Returns [searchRef, handleTypeaheadSearch, reset].
 * `externalSearchRef` lets callers share state via context. `onSearchChange` may return
 * a replacement string to store (used for fallback-to-last-key behavior).
 */
export function useTypeaheadSearch(
  onSearchChange: (search: string, key: string) => string | undefined,
  externalSearchRef?: React.RefObject<string>,
) {
  const handleSearchChange = useCallbackRef(onSearchChange)
  const internalSearchRef = React.useRef('')
  const searchRef = externalSearchRef ?? internalSearchRef
  const timerRef = React.useRef(0)

  const handleTypeaheadSearch = React.useCallback(
    (key: string) => {
      const search = searchRef.current + key
      const nextSearch = handleSearchChange(search, key)
      const resolvedSearch = typeof nextSearch === 'string' ? nextSearch : search

      ;(function updateSearch(value: string) {
        searchRef.current = value
        window.clearTimeout(timerRef.current)
        if (value !== '') timerRef.current = window.setTimeout(() => updateSearch(''), 1000)
      })(resolvedSearch)
    },
    [handleSearchChange, searchRef],
  )

  const resetTypeahead = React.useCallback(() => {
    searchRef.current = ''
    window.clearTimeout(timerRef.current)
  }, [searchRef])

  React.useEffect(() => {
    return () => window.clearTimeout(timerRef.current)
  }, [])

  return [searchRef, handleTypeaheadSearch, resetTypeahead] as const
}

interface ITypeaheadListState {
  activeElement: Element | null
  lastMatchedElement: HTMLElement | null
}

interface ITypeaheadListNavigationOptions<T> {
  /** Candidates to search; callers must pre-filter disabled/hidden items. */
  getItems: () => T[]
  getItemElement: (item: T) => HTMLElement | null
  /** Searchable text; empty strings are skipped. */
  getItemTextValue: (item: T) => string
  onMatch: (item: T) => void
  /** Override current-item (e.g. SelectTrigger uses selected value instead of focus). */
  getCurrentItem?: (items: T[], state: ITypeaheadListState) => T | undefined
  /** Share typeahead state via context. */
  externalSearchRef?: React.RefObject<string>
}

/**
 * Typeahead list navigation. Falls back to latest key when accumulated search misses,
 * and tracks last matched element so consecutive keys stay stable across async focus shifts.
 */
export function useTypeaheadListNavigation<T>(options: ITypeaheadListNavigationOptions<T>) {
  const lastMatchedRefObject = React.useRef<HTMLElement | null>(null)

  const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search, key) => {
    const items = options.getItems()
    const searchableItems = items
      .map((item) => ({
        item,
        textValue: options.getItemTextValue(item).trim(),
      }))
      .filter((entry) => entry.textValue !== '')

    if (searchableItems.length === 0) return ''

    const state: ITypeaheadListState = {
      activeElement: document.activeElement,
      lastMatchedElement: lastMatchedRefObject.current,
    }

    const defaultCurrentItem =
      searchableItems.find((entry) => options.getItemElement(entry.item) === state.activeElement)?.item ??
      searchableItems.find((entry) => options.getItemElement(entry.item) === state.lastMatchedElement)?.item

    const currentItem =
      options.getCurrentItem?.(
        searchableItems.map((entry) => entry.item),
        state,
      ) ?? defaultCurrentItem

    const currentEntry = currentItem ? searchableItems.find((entry) => entry.item === currentItem) : undefined

    let nextEntry = findNextItem(searchableItems, search, currentEntry)
    let effectiveSearch = search

    if (!nextEntry && search.length > 1) {
      effectiveSearch = key
      nextEntry = findNextItem(searchableItems, effectiveSearch, currentEntry)
    }

    if (nextEntry) {
      const nextElement = options.getItemElement(nextEntry.item)
      if (nextElement) lastMatchedRefObject.current = nextElement
      options.onMatch(nextEntry.item)
    }

    return effectiveSearch
  }, options.externalSearchRef)

  const resetTypeaheadState = React.useCallback(() => {
    resetTypeahead()
    lastMatchedRefObject.current = null
  }, [resetTypeahead])

  return [searchRef, handleTypeaheadSearch, resetTypeaheadState] as const
}

interface IVimNavigationOptions {
  onNavigate?: () => void
  ggTimeoutMs?: number
}

/**
 * Vim-style list bindings: `gg` (two g within ggTimeoutMs) -> first item, `G` -> last item.
 * Handler returns true when a command fired (caller must skip typeahead/nav). The first
 * `g` returns false so typeahead still fires on items starting with 'g'.
 */
export function useVimNavigation(options: IVimNavigationOptions = {}) {
  const { ggTimeoutMs = 300 } = options
  const lastGPressRef = React.useRef(0)
  const onNavigate = useCallbackRef(options.onNavigate ?? (() => {}))

  const handleVimKey = React.useCallback(
    (event: KeyboardEvent | React.KeyboardEvent, items: HTMLElement[]): boolean => {
      if (items.length === 0) return false
      if (event.ctrlKey || event.altKey || event.metaKey) {
        lastGPressRef.current = 0
        return false
      }

      if (event.key === 'G' && event.shiftKey) {
        lastGPressRef.current = 0
        event.preventDefault()
        onNavigate()
        const last = items[items.length - 1]
        if (last) setTimeout(() => focusFirst([last]))
        return true
      }

      if (event.key === 'g' && !event.shiftKey) {
        const now = Date.now()
        if (now - lastGPressRef.current < ggTimeoutMs) {
          lastGPressRef.current = 0
          event.preventDefault()
          onNavigate()
          const first = items[0]
          if (first) setTimeout(() => focusFirst([first]))
          return true
        }
        lastGPressRef.current = now
        return false
      }

      // any other key cancels pending `g`
      lastGPressRef.current = 0
      return false
    },
    [ggTimeoutMs, onNavigate],
  )

  return handleVimKey
}
