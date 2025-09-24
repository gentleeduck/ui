export type DuckTableColumnSort = { label: Lowercase<string>; direction: 'asc' | 'desc' | 'none' }

type ColumnValues = { label: Lowercase<string>; filterFn?: Function; visible: boolean; enum?: readonly string[] }
export type DuckColumnValues =
  | (ColumnValues & { sortable: false })
  | (ColumnValues & { sortable: true; direction: DuckTableColumnSort['direction'] })

export type DuckTableRow<TColumn extends readonly Lowercase<string>[]> = {
  readonly _normalized?: Readonly<Record<TColumn[number], string>>
} & Record<'id' | TColumn[number], string>

export type DuckTableOptions<TColumn extends readonly Lowercase<string>[]> = {
  columns: Record<TColumn[number], DuckColumnValues>
  rows: DuckTableRow<TColumn>[]
  query?: Partial<Record<TColumn[number], string>> | string
  selectedRows?: string[]
  currentPage?: number
  pageSize?: number
  sortConfig?: DuckTableColumnSort[]
  visibleColumns?: (keyof DuckTableOptions<TColumn>['columns'])[]
  version?: string
}

export type DuckTableHistoryDelta = {
  version: number
  type: DuckTableEventType
  timestamp: number
  ids: string[]
  meta: any
}
export type DuckTableEvent<TColumn extends readonly Lowercase<string>[]> =
  | { type: 'init'; meta: {} }
  | { type: 'sort'; meta: { cached: boolean; sortConfig: DuckTableColumnSort[] } }
  | { type: 'filter'; meta: { query?: Partial<Record<TColumn[number], string>> | string; reason?: string } }
  | { type: 'page'; meta: { page?: number; pageSize?: number } }
  | { type: 'jump'; meta: { version: number } }
  | { type: 'undo'; meta: { version: number } }
  | { type: 'redo'; meta: { version: number } }
  | { type: 'compress'; meta: { removed: DuckTableHistoryDelta[] } }
  | { type: 'storage-sync'; meta: { version: string } }
  | { type: 'column-visibility'; meta: { label: keyof DuckTableOptions<TColumn>['columns']; visible: boolean } }
  | { type: 'edit'; meta: { id: string; changes: Partial<Record<'id' | TColumn[number], string>> } }
  | { type: 'add'; meta: { id: string } }
  | { type: 'delete'; meta: { id: string } }
  | { type: 'select'; meta: { ids: string[] } }
  | { type: 'reset'; meta: { rowCount: number } }
  | { type: 'hydrate'; meta: { snapshot: DuckTableOptions<TColumn> } }

export type DuckTableEventType = DuckTableEvent<any>['type']

export type DuckTableEventMeta<T extends DuckTableEventType, TColumn extends readonly Lowercase<string>[]> = Extract<
  DuckTableEvent<TColumn>,
  { type: T }
>['meta']

/**
 * TODOs for DuckTable improvements
 * -------------------------------
 * 1. Filtering: normalized + indexed (done)
 * 2. Sorting: better cache key + custom sortFn (done)
 * 3. Event system: granular emitChange (done)
 * 4. Dirty tracking: track & clear mutated rows (done)
 * 5. Snapshot/hydration: localStorage + versioning (done)
 *
 * 6. View decoupling
 * - [ ] Add `manualPagination?: boolean` in options
 * - [ ] Add `externalRows?: Row[]` for server rows
 * - [ ] Update `getCurrentPageRows()` and `getTotalPages()` to respect `manualPagination`
 * - [ ] Add `setExternalRows(rows)` method
 *
 * 7. Typing improvements
 * - [ ] Replace `THeader extends string[]` with `TColumns extends Record<string, HeaderValues>`
 * - [ ] Refactor usages of `THeader[number]` to use `keyof TColumns`
 *
 * 8. Undo/Redo stack
 * - [ ] Add history of actions with `undo()` and `redo()` methods
 * - [ ] Configurable max stack depth
 *
 * 9. Dev Tools APIs
 * - [ ] `inspectRow(id)` for debugging
 * - [ ] `logStats()` for performance metrics
 * - [ ] Runtime debug toggle
 *
 * 10. Virtual scrolling
 * - [ ] Expose APIs like `getRowRange(start, end)`
 * - [ ] Allow virtualization-aware filtering and sorting
 *
 * 1. Advanced filtering
 * - [ ] Support filter operators: `contains`, `startsWith`, `=`, `!=`, etc.
 * - [ ] Add column filter strategy hooks
 *
 * 12. Column groups / aggregation
 * - [ ] Group columns visually
 * - [ ] Add reducer support (sum, avg, etc.)
 *
 * 13. Testing
 * - [ ] Write unit tests for filtering, sorting, pagination
 * - [ ] Snapshot tests for consistent state
 */
