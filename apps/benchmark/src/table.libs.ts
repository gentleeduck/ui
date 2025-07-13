import {
  DuckColumnValues,
  DuckTableColumnSort,
  DuckTableEvent,
  DuckTableEventMeta,
  DuckTableEventType,
  DuckTableHistoryDelta,
  DuckTableOptions,
} from './table.types'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_CURRENT_PAGE = 1
type NormalizedRow<T> = T & {
  _normalized?: Record<string, string>
}

export class DuckTable<TColumn extends Lowercase<string>[]> {
  private columns: DuckTableOptions<TColumn>['columns'] = {} as never
  private visibleColumns: (keyof DuckTableOptions<TColumn>['columns'])[] = []
  private rows: DuckTableOptions<TColumn>['rows'] = []
  private mutatedRows: DuckTableOptions<TColumn>['rows'] = []
  private selectedRows: DuckTableOptions<TColumn>['rows'][number]['id'][] = []
  private query: Partial<Record<TColumn[number], string>> | string
  private currentPage = DEFAULT_CURRENT_PAGE
  private pageSize = DEFAULT_PAGE_SIZE
  private sortConfig: DuckTableColumnSort[] = []
  private sortCache = new Map<string, number[]>()

  private indexedValues = new Map<string, Map<string, Set<number>>>()
  private _pendingReapply = false
  private dirtyRowIds: Set<string> = new Set()
  private normalizedData: NormalizedRow<DuckTableOptions<TColumn>['rows'][number]>[] = []
  private static readonly CURRENT_SNAPSHOT_VERSION = 'v1.0.0'

  private debug = false

  // Change listeners
  private changeListeners: Array<(event: DuckTableEvent<TColumn>) => void> = []

  constructor(options: DuckTableOptions<TColumn>) {
    this.columns = options.columns
    this.rows = options.rows
    this.mutatedRows = options.rows.slice()
    this.assertUniqueIds(this.rows)
    this.query = options.query ?? ''
    this.visibleColumns = (Object.keys(this.columns) as any[]).filter(
      (k) => this.columns[k as TColumn[number]].visible,
    ) as typeof this.visibleColumns
    this.pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
    this.normalizedData = this.rows.map((row) => this.addNormalized(row))

    this.sortConfig = Object.values(this.columns).map((h) => {
      const hv = h as DuckColumnValues & { direction?: DuckTableHistoryDelta['type'] }
      return { label: hv.label, direction: hv.direction || 'none' }
    }) as DuckTableColumnSort[]
  }

  private reapplyView(): void {
    this.setQuery(this.query)
    this.setColumnSort(this.sortConfig)
  }

  public updateRow(id: string, partial: Partial<DuckTableOptions<TColumn>['rows'][number]>): void {
    const index = this.rows.findIndex((r) => r.id === id)
    if (index === -1) throw new Error(`Row with id ${id} not found`)

    const updated = this.addNormalized({ ...this.rows[index], ...partial })
    this.rows[index] = updated
    this.normalizedData[index] = updated

    this.dirtyRowIds.add(id)
    this.debounceReapplyView()
  }

  public addRow(row: DuckTableOptions<TColumn>['rows'][number]): void {
    if (this.rows.find((r) => r.id === row.id)) {
      throw new Error(`Row with id ${row.id} already exists`)
    }
    const normalized = this.addNormalized(row)
    this.rows = [...this.rows, normalized]
    this.normalizedData = [...this.normalizedData, normalized]
    this.debounceReapplyView()
  }

  public setRows(rows: DuckTableOptions<TColumn>['rows']): void {
    console.log(rows, 'inside')
    this.rows = rows
  }

  public setMutatedRows(rows: DuckTableOptions<TColumn>['rows']): void {
    this.mutatedRows = rows
    // this.setRows(rows)
  }

  public deleteRow(id: string): void {
    this.rows = this.rows.filter((r) => r.id !== id)
    this.debounceReapplyView()
  }

  /**
   * Subscribe to table events
   */
  public onTableChange(fn: (event: DuckTableEvent<TColumn>) => void): void {
    this.changeListeners.push(fn)
  }

  private assertUniqueIds(rows: DuckTableOptions<TColumn>['rows']): void {
    const seen = new Set<string>()
    for (const r of rows) {
      if (seen.has(r.id)) throw new Error(`Duplicate ID: ${r.id}`)
      seen.add(r.id)
    }
  }

  private emitChange<T extends DuckTableEventType>(type: T, meta: DuckTableEventMeta<T, TColumn>): void {
    const event = { type, meta } as DuckTableEvent<TColumn>
    for (const listener of this.changeListeners) {
      listener(event)
    }

    if (this.debug) console.debug(`[DuckTable] ${type}`, meta)

    const changeTypes: DuckTableEventType[] = ['sort', 'filter', 'page']
    if (!changeTypes.includes(type)) return
  }

  public enableDebug(): void {
    this.debug = true
  }

  public setColumns(columns: DuckTableOptions<TColumn>['columns']): void {
    this.columns = columns
    this.reapplyView()
  }

  public getColumns() {
    return this.columns
  }

  public getVisibleColumns() {
    return this.visibleColumns
  }

  public toggleColumnVisibility(label: keyof DuckTableOptions<TColumn>['columns']): void {
    if (this.visibleColumns.includes(label)) {
      this.visibleColumns = this.visibleColumns.filter((col) => col !== label)
    } else {
      this.visibleColumns.push(label)
    }

    this.columns = Object.fromEntries(
      Object.entries(this.columns).map(([key, col]) => [
        key,
        key === label
          ? { ...(col as DuckColumnValues), visible: !(col as DuckColumnValues).visible } // shallow clone only the toggled column
          : col,
      ]),
    ) as DuckTableOptions<TColumn>['columns']

    this.visibleColumns = [...this.visibleColumns]
    this.emitChange('column-visibility', { label, visible: this.visibleColumns.includes(label) })
  }

  public getColumnSort() {
    return this.sortConfig
  }

  public setColumnSort(sortConfig: DuckTableColumnSort[]): void {
    this.sortConfig = sortConfig
    const active = sortConfig.filter((s) => s.direction !== 'none')
    const key = active.map(({ label, direction }) => `${label.toLowerCase()}:${direction}`).join('|')

    if (this.sortCache.has(key)) {
      this.mutatedRows = this.sortCache.get(key)!.map((i) => this.rows[i])
      this.emitChange('sort', { cached: true, sortConfig })
      return
    }

    if (active.length === 0) {
      this.mutatedRows = [...this.rows]
      this.emitChange('sort', { cached: false, sortConfig })
      return
    }

    const idxs = this.rows
      .map((row, idx) => ({ row, idx }))
      .sort((a, b) => {
        for (const { label, direction } of active) {
          const header = this.columns[label as keyof typeof this.columns] as DuckColumnValues & {
            sortFn?: (a: any, b: any) => number
          }
          const aV = a.row[label as keyof typeof a.row]
          const bV = b.row[label as keyof typeof b.row]

          if (aV == null && bV == null) continue
          if (aV == null) return direction === 'asc' ? -1 : 1
          if (bV == null) return direction === 'asc' ? 1 : -1
          if (aV === bV) continue

          if (header.sortFn) {
            return direction === 'asc' ? header.sortFn(aV, bV) : -header.sortFn(aV, bV)
          }
          return direction === 'asc' ? (aV > bV ? 1 : -1) : aV < bV ? 1 : -1
        }
        return 0
      })
      .map((e) => e.idx)

    this.sortCache.set(key, idxs)
    this.mutatedRows = idxs.map((i) => this.rows[i])
    this.emitChange('sort', { cached: false, sortConfig })
  }

  public getRows() {
    return this.rows
  }

  public resetRows(data: DuckTableOptions<TColumn>['rows']): void {
    this.assertUniqueIds(data)
    this.rows = data
    this.mutatedRows = data.slice()
    this.sortCache.clear()
    this.indexedValues.clear()
    this.dirtyRowIds.clear()
    this.normalizedData = this.rows.map((row) => this.addNormalized(row))

    this.emitChange('reset', { rowCount: data.length })
  }

  public getMutatedRows() {
    return this.mutatedRows
  }

  public getQuery() {
    return this.query
  }

  public setQuery(query: Partial<Record<TColumn[number], string>> | string): void {
    this.query = query
    this.clearArray(this.mutatedRows)

    if (typeof query === 'string') {
      const lowerQ = query.toLowerCase()
      for (let i = 0; i < this.normalizedData.length; i++) {
        const row = this.normalizedData[i]
        const match = this.visibleColumns.some((k) => {
          const h = this.columns[k]
          return h?.filterFn ? h.filterFn(row, query) : row._normalized?.[k]?.includes(lowerQ)
        })
        if (match) this.mutatedRows.push(this.rows[i])
      }
    } else if (typeof query === 'object' && query !== null) {
      const matchedSets: Set<number>[] = []

      for (const [col, q] of Object.entries(query)) {
        if (!q) continue
        const normQ = this.normalize(q)
        const column = col as TColumn[number]

        this.buildIndexIfMissing(column)
        const columnIndex = this.indexedValues.get(column)
        if (!columnIndex) continue

        const matchingKeys = [...columnIndex.keys()].filter((k) => k.includes(normQ))
        const matched = new Set<number>()
        for (const key of matchingKeys) {
          for (const idx of columnIndex.get(key)!) {
            matched.add(idx)
          }
        }
        matchedSets.push(matched)
      }

      const finalSet = matchedSets.reduce(
        (a, b) => new Set([...a].filter((x) => b.has(x))),
        matchedSets[0] ?? new Set(this.rows.map((_, i) => i)),
      )

      for (const i of finalSet) this.mutatedRows.push(this.rows[i])
    } else {
      for (let i = 0; i < this.rows.length; i++) {
        this.mutatedRows.push(this.rows[i])
      }
    }

    this.setSelectedRows(this.selectedRows.filter((id) => this.mutatedRows.some((r) => r.id === id)))
    this.setCurrentPage(1)
    this.emitChange('filter', { query })
  }

  public getSelectedRows() {
    return this.selectedRows
  }

  public setSelectedRows(ids: string[]): void {
    this.selectedRows = ids
    this.emitChange('select', { ids })
  }

  public getCurrentPage(): number {
    return this.mutatedRows.length > 0 ? this.currentPage : 0
  }

  public getPageSize(): number {
    return this.pageSize
  }

  public setCurrentPage(page: number): void {
    this.currentPage = page
    this.emitChange('page', { page, pageSize: this.pageSize })
  }

  public setPageSize(size: number): void {
    this.pageSize = size
    this.currentPage = 1
    this.emitChange('page', { page: 1, pageSize: size })
  }

  public getTotalPages(): number {
    return Math.ceil(this.mutatedRows.length / this.pageSize)
  }

  public getCurrentPageRows() {
    const total = this.getTotalPages()
    if (this.currentPage > total) this.currentPage = 1
    const start = (this.currentPage - 1) * this.pageSize
    return this.mutatedRows.slice(start, start + this.pageSize)
  }

  private normalize(val: unknown): string {
    return String(val ?? '').toLowerCase()
  }

  private buildIndexIfMissing(column: TColumn[number]) {
    if (this.indexedValues.has(column)) return

    const colIndex = new Map<string, Set<number>>()

    for (let i = 0; i < this.rows.length; i++) {
      const val = this.normalize(this.rows[i][column as keyof (typeof this.rows)[number]])
      if (!colIndex.has(val)) colIndex.set(val, new Set())
      colIndex.get(val)!.add(i)
    }

    this.indexedValues.set(column, colIndex)
  }

  private debounceReapplyView(): void {
    if (this._pendingReapply) return
    this._pendingReapply = true
    queueMicrotask(() => {
      this._pendingReapply = false
      this.reapplyView()
    })
  }

  public getDirtyRowIds(): string[] {
    return Array.from(this.dirtyRowIds)
  }

  public isRowDirty(id: string): boolean {
    return this.dirtyRowIds.has(id)
  }

  public clearDirtyRow(id: string): void {
    this.dirtyRowIds.delete(id)
  }

  public clearAllDirtyRows(): void {
    this.dirtyRowIds.clear()
  }

  private addNormalized(row: DuckTableOptions<TColumn>['rows'][number]): NormalizedRow<typeof row> {
    const normalized: Record<string, string> = {}
    for (const key of Object.keys(this.columns)) {
      const val = row[key as keyof typeof row]
      normalized[key] = typeof val === 'string' ? val.toLowerCase() : String(val ?? '').toLowerCase()
    }
    return { ...row, _normalized: normalized }
  }

  private clearArray<T>(arr: T[]): void {
    arr.length = 0
  }

  public getSnapshot(): DuckTableOptions<TColumn> {
    return {
      version: DuckTable.CURRENT_SNAPSHOT_VERSION,
      query: this.query,
      selectedRows: [...this.selectedRows],
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      sortConfig: JSON.parse(JSON.stringify(this.sortConfig)),
      visibleColumns: [...this.visibleColumns],
      rows: this.rows,
      columns: this.columns,
    }
  }

  public hydrate(snapshot: DuckTableOptions<TColumn>): void {
    if (snapshot.query) {
      this.query = snapshot.query
    }
    if (snapshot.selectedRows) {
      this.selectedRows = [...snapshot.selectedRows]
    }
    if (snapshot.currentPage) {
      this.currentPage = snapshot.currentPage
    }
    if (snapshot.rows) {
      this.rows = snapshot.rows
    }
    if (snapshot.columns) {
      this.columns = snapshot.columns
    }
    if (snapshot.pageSize) {
      this.pageSize = snapshot.pageSize
    }
    if (snapshot.visibleColumns) {
      this.visibleColumns = [...snapshot.visibleColumns]
    }
    if (snapshot.sortConfig) {
      this.sortConfig = JSON.parse(JSON.stringify(snapshot.sortConfig))
    }

    this.reapplyView()
    this.emitChange('hydrate', snapshot as any)
  }

  public persistSnapshot(key: string): void {
    const json = JSON.stringify(this.getSnapshot())
    localStorage.setItem(key, json)
    this.emitChange('storage-sync', { version: DuckTable.CURRENT_SNAPSHOT_VERSION })
  }

  public loadSnapshot(key: string): void {
    const raw = localStorage.getItem(key)
    if (!raw) return
    this.hydrate(JSON.parse(raw))
    this.emitChange('storage-sync', { version: DuckTable.CURRENT_SNAPSHOT_VERSION })
  }
}
