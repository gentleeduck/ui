export type DuckTableColumnSort = { label: Lowercase<string>; direction: 'asc' | 'desc' | 'none' }
export type HeaderValues =
  | { value: Lowercase<string>; filterFn?: Function; visible: boolean; sortable: false }
  | {
      value: Lowercase<string>
      filterFn?: Function
      visible: boolean
      sortable: true
      direction: DuckTableColumnSort['direction']
    }

export type DuckTableRow<THeader extends readonly Lowercase<string>[]> = {
  readonly _normalized?: Readonly<Record<THeader[number], string>>
} & Record<'id' | THeader[number], string>

export type DuckTableOptions<THeader extends readonly Lowercase<string>[]> = {
  data: DuckTableRow<THeader>[]
  query?: Partial<Record<THeader[number], string>> | string
  selectedRows?: string[]
  headers: Record<THeader[number], HeaderValues>
  currentPage?: number
  pageSize?: number
  sortConfig?: DuckTableColumnSort[]
  visibleColumns?: (keyof DuckTableOptions<THeader>['headers'])[]
  version: string
}

export type HistoryDelta = {
  version: number
  type: DuckTableEventType
  timestamp: number
  ids: string[]
  meta: any
}
export type DuckTableEvent<THeader extends readonly Lowercase<string>[]> =
  | { type: 'init'; meta: {} }
  | { type: 'sort'; meta: { cached: boolean; sortConfig: DuckTableColumnSort[] } }
  | { type: 'filter'; meta: { query?: Partial<Record<THeader[number], string>> | string; reason?: string } }
  | { type: 'page'; meta: { page?: number; pageSize?: number } }
  | { type: 'jump'; meta: { version: number } }
  | { type: 'undo'; meta: { version: number } }
  | { type: 'redo'; meta: { version: number } }
  | { type: 'compress'; meta: { removed: HistoryDelta[] } }
  | { type: 'storage-sync'; meta: { version: string } }
  | { type: 'column-visibility'; meta: { label: keyof DuckTableOptions<THeader>['headers']; visible: boolean } }
  | { type: 'edit'; meta: { id: string; changes: Partial<Record<'id' | THeader[number], string>> } }
  | { type: 'add'; meta: { id: string } }
  | { type: 'delete'; meta: { id: string } }
  | { type: 'select'; meta: { ids: string[] } }
  | { type: 'reset'; meta: { rowCount: number } }
  | { type: 'hydrate'; meta: { snapshot: DuckTableOptions<THeader> } }

export type DuckTableEventType = DuckTableEvent<any>['type']

export type DuckTableEventMeta<T extends DuckTableEventType, THeader extends readonly Lowercase<string>[]> = Extract<
  DuckTableEvent<THeader>,
  { type: T }
>['meta']

/**
 * TODOs for DuckTable improvements
 * -------------------------------
 * ✅ 1. Filtering: normalized + indexed (done)
 * ✅ 2. Sorting: better cache key + custom sortFn (done)
 * ✅ 3. Event system: granular emitChange (done)
 * ✅ 4. Dirty tracking: track & clear mutated rows (done)
 * ✅ 5. Snapshot/hydration: localStorage + versioning (done)
 *
 * 🟡 6. View decoupling
 *    - [ ] Add `manualPagination?: boolean` in options
 *    - [ ] Add `externalRows?: Row[]` for server rows
 *    - [ ] Update `getCurrentPageRows()` and `getTotalPages()` to respect `manualPagination`
 *    - [ ] Add `setExternalRows(rows)` method
 *
 * 🟡 7. Typing improvements
 *    - [ ] Replace `THeader extends string[]` with `TColumns extends Record<string, HeaderValues>`
 *    - [ ] Refactor usages of `THeader[number]` to use `keyof TColumns`
 *
 * 🧠 8. Undo/Redo stack
 *    - [ ] Add history of actions with `undo()` and `redo()` methods
 *    - [ ] Configurable max stack depth
 *
 * 🧰 9. Dev Tools APIs
 *    - [ ] `inspectRow(id)` for debugging
 *    - [ ] `logStats()` for performance metrics
 *    - [ ] Runtime debug toggle
 *
 * 🌀 10. Virtual scrolling
 *    - [ ] Expose APIs like `getRowRange(start, end)`
 *    - [ ] Allow virtualization-aware filtering and sorting
 *
 * ⚙ 11. Advanced filtering
 *    - [ ] Support filter operators: `contains`, `startsWith`, `=`, `!=`, etc.
 *    - [ ] Add column filter strategy hooks
 *
 * 📁 12. Column groups / aggregation
 *    - [ ] Group columns visually
 *    - [ ] Add reducer support (sum, avg, etc.)
 *
 * 🧪 13. Testing
 *    - [ ] Write unit tests for filtering, sorting, pagination
 *    - [ ] Snapshot tests for consistent state
 */
