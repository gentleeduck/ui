/**
 * @internal
 * Shared list-navigation utilities used by Select and Command primitives.
 */

import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'

export const NAVIGATION_KEYS = ['ArrowUp', 'ArrowDown', 'Home', 'End'] as const
export const SELECTION_KEYS = [' ', 'Enter']

/**
 * Focuses the first candidate element that accepts focus, scrolling it into view.
 */
export function focusFirst(candidates: Array<HTMLElement | null>) {
  const previouslyFocused = document.activeElement
  for (const candidate of candidates) {
    if (candidate === previouslyFocused) return
    candidate?.scrollIntoView({ block: 'nearest' })
    candidate?.focus({ preventScroll: true })
    if (document.activeElement !== previouslyFocused) return
  }
}

/**
 * Computes the ordered list of navigation candidates for arrow-key movement.
 * Reverses order for ArrowUp/End, slices from current element for ArrowUp/ArrowDown.
 */
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

/**
 * Wraps an array around itself at a given start index.
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
export function wrapArray<T>(array: T[], startIndex: number) {
  // biome-ignore lint/style/noNonNullAssertion: modulo guarantees the index is always within bounds
  return array.map<T>((_, index) => array[(startIndex + index) % array.length]!)
}

/**
 * Finds the next item matching a typeahead search string.
 * Normalizes repeated chars (e.g. 'aaa' -> 'a') for cycling behavior.
 * A fresh single-char search starts from the top of the list.
 * Repeated-char searches wrap from the current item and exclude it so focus advances.
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
 * Hook for typeahead search with 1-second auto-reset.
 * Returns [searchRef, handleTypeaheadSearch, resetTypeahead].
 *
 * Pass an optional externalSearchRef to use an existing ref (e.g. one stored
 * in context) instead of creating a new one. The hook will read/write that ref
 * directly and reset it after the 1-second timeout, keeping it in sync.
 *
 * onSearchChange may optionally return a replacement search string that the
 * hook should store (useful for fallback behavior, e.g. resetting to last key).
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
  /**
   * Returns candidate items to search. Callers should pre-filter out disabled/hidden items.
   */
  getItems: () => T[]
  /**
   * Returns the element for an item. Used for focus-based current-item detection.
   */
  getItemElement: (item: T) => HTMLElement | null
  /**
   * Returns searchable text for an item. Empty strings are ignored.
   */
  getItemTextValue: (item: T) => string
  /**
   * Called when a matching item is found.
   */
  onMatch: (item: T) => void
  /**
   * Optional current-item resolver override (e.g. SelectTrigger uses selected value instead of focus).
   */
  getCurrentItem?: (items: T[], state: ITypeaheadListState) => T | undefined
  /**
   * Optional external ref to keep typeahead search state in shared context.
   */
  externalSearchRef?: React.RefObject<string>
}

/**
 * Shared typeahead-list navigation:
 * - Uses `findNextItem` matching semantics (single-char from top, repeated-char cycling, wrap).
 * - Falls back to latest key when accumulated search has no match.
 * - Tracks last matched element so consecutive keys remain stable during async focus changes.
 * - Reuses `useTypeaheadSearch` timeout/reset behavior.
 *
 * Returns [searchRef, handleTypeaheadSearch, resetTypeaheadState].
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
 * Hook for vim-like navigation keybindings in list components.
 *
 * Supported bindings:
 *   gg      -- focus first item (two g presses within 300ms)
 *   G       -- focus last item  (Shift+G)
 *
 * Returns a handler: (event, items) => boolean.
 * Returns true when a vim command was executed (caller should skip typeahead/nav).
 * Returns false otherwise (caller proceeds normally).
 *
 * The first g press returns false so typeahead still fires for 'g' items.
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

      // G (Shift+G) -> focus last item
      if (event.key === 'G' && event.shiftKey) {
        lastGPressRef.current = 0
        event.preventDefault()
        onNavigate()
        const last = items[items.length - 1]
        if (last) setTimeout(() => focusFirst([last]))
        return true
      }

      // gg -> focus first item (two g presses within 300ms)
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

      // Any other key cancels pending "g" sequence.
      lastGPressRef.current = 0
      return false
    },
    [ggTimeoutMs, onNavigate],
  )

  return handleVimKey
}
