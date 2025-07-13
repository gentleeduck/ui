import {
  DuckTableColumnSort,
  DuckTableEvent,
  DuckTableEventMeta,
  DuckTableEventType,
  DuckTableOptions,
  HeaderValues,
  HistoryDelta,
} from './table.types'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_CURRENT_PAGE = 1
type NormalizedRow<T> = T & {
  _normalized?: Record<string, string>
}

export class DuckTable<THeader extends Lowercase<string>[]> {
  private headers: DuckTableOptions<THeader>['headers'] = {} as never
  private visibleColumns: (keyof DuckTableOptions<THeader>['headers'])[] = []
  private rawData: DuckTableOptions<THeader>['data'] = []
  private viewRows: DuckTableOptions<THeader>['data'] = []
  private selectedRows: DuckTableOptions<THeader>['data'][number]['id'][] = []
  private query: Partial<Record<THeader[number], string>> | string
  private currentPage = DEFAULT_CURRENT_PAGE
  private pageSize = DEFAULT_PAGE_SIZE
  private sortConfig: DuckTableColumnSort[] = []
  private sortCache = new Map<string, number[]>()

  private indexedValues = new Map<string, Map<string, Set<number>>>()
  private _pendingReapply = false
  private dirtyRowIds: Set<string> = new Set()
  private normalizedData: NormalizedRow<DuckTableOptions<THeader>['data'][number]>[] = []
  private static readonly CURRENT_SNAPSHOT_VERSION = 'v1.0.0'

  private debug = false

  // Change listeners
  private changeListeners: Array<(event: DuckTableEvent<THeader>) => void> = []

  constructor(options: DuckTableOptions<THeader>) {
    this.headers = options.headers
    this.rawData = options.data
    this.viewRows = options.data.slice()
    this.assertUniqueIds(this.rawData)
    this.query = options.query ?? ''
    this.visibleColumns = (Object.keys(this.headers) as any[]).filter(
      (k) => this.headers[k as THeader[number]].visible,
    ) as typeof this.visibleColumns
    this.pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
    this.normalizedData = this.rawData.map((row) => this.addNormalized(row))

    this.sortConfig = Object.values(this.headers).map((h) => {
      const hv = h as HeaderValues & { direction?: HistoryDelta['type'] }
      return { label: hv.value, direction: hv.direction || 'none' }
    }) as DuckTableColumnSort[]
  }

  private reapplyView(): void {
    this.setQuery(this.query)
    this.setColumnSort(this.sortConfig)
  }

  public updateRow(id: string, partial: Partial<DuckTableOptions<THeader>['data'][number]>): void {
    const index = this.rawData.findIndex((r) => r.id === id)
    if (index === -1) throw new Error(`Row with id ${id} not found`)

    const updated = this.addNormalized({ ...this.rawData[index], ...partial })
    this.rawData[index] = updated
    this.normalizedData[index] = updated

    this.dirtyRowIds.add(id)
    this.debounceReapplyView()
  }

  public addRow(row: DuckTableOptions<THeader>['data'][number]): void {
    if (this.rawData.find((r) => r.id === row.id)) {
      throw new Error(`Row with id ${row.id} already exists`)
    }
    const normalized = this.addNormalized(row)
    this.rawData.push(normalized)
    this.normalizedData.push(normalized)
    this.debounceReapplyView()
  }

  public deleteRow(id: string): void {
    this.rawData = this.rawData.filter((r) => r.id !== id)
    this.debounceReapplyView()
  }

  /**
   * Subscribe to table events
   */
  public onTableChange(fn: (event: DuckTableEvent<THeader>) => void): void {
    this.changeListeners.push(fn)
  }

  private assertUniqueIds(rows: DuckTableOptions<THeader>['data']): void {
    const seen = new Set<string>()
    for (const r of rows) {
      if (seen.has(r.id)) throw new Error(`Duplicate ID: ${r.id}`)
      seen.add(r.id)
    }
  }

  private emitChange<T extends DuckTableEventType>(type: T, meta: DuckTableEventMeta<T, THeader>): void {
    const event = { type, meta } as DuckTableEvent<THeader>
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

  public getColumns() {
    return this.headers
  }

  public getVisibleColumns() {
    return this.visibleColumns
  }

  public toggleColumnVisibility(label: keyof DuckTableOptions<THeader>['headers']): void {
    if (this.visibleColumns.includes(label)) {
      this.visibleColumns = this.visibleColumns.filter((col) => col !== label)
    } else {
      this.visibleColumns.push(label)
    }
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
      this.viewRows = this.sortCache.get(key)!.map((i) => this.rawData[i])
      this.emitChange('sort', { cached: true, sortConfig })
      return
    }

    if (active.length === 0) {
      this.viewRows = [...this.rawData]
      this.emitChange('sort', { cached: false, sortConfig })
      return
    }

    const idxs = this.rawData
      .map((row, idx) => ({ row, idx }))
      .sort((a, b) => {
        for (const { label, direction } of active) {
          const header = this.headers[label as keyof typeof this.headers] as HeaderValues & {
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
    this.viewRows = idxs.map((i) => this.rawData[i])
    this.emitChange('sort', { cached: false, sortConfig })
  }

  public getRows() {
    return this.rawData
  }

  public resetRows(data: DuckTableOptions<THeader>['data']): void {
    this.assertUniqueIds(data)
    this.rawData = data
    this.viewRows = data.slice()
    this.sortCache.clear()
    this.indexedValues.clear()
    this.dirtyRowIds.clear()
    this.normalizedData = this.rawData.map((row) => this.addNormalized(row))

    this.emitChange('reset', { rowCount: data.length })
  }

  public getMutatedRows() {
    return this.viewRows
  }

  public getQuery() {
    return this.query
  }

  public setQuery(query: Partial<Record<THeader[number], string>> | string): void {
    this.query = query
    this.clearArray(this.viewRows)

    if (typeof query === 'string') {
      const lowerQ = query.toLowerCase()
      for (let i = 0; i < this.normalizedData.length; i++) {
        const row = this.normalizedData[i]
        const match = this.visibleColumns.some((k) => {
          const h = this.headers[k]
          return h?.filterFn ? h.filterFn(row, query) : row._normalized?.[k]?.includes(lowerQ)
        })
        if (match) this.viewRows.push(this.rawData[i])
      }
    } else if (typeof query === 'object' && query !== null) {
      const matchedSets: Set<number>[] = []

      for (const [col, q] of Object.entries(query)) {
        if (!q) continue
        const normQ = this.normalize(q)
        const column = col as THeader[number]

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
        matchedSets[0] ?? new Set(this.rawData.map((_, i) => i)),
      )

      for (const i of finalSet) this.viewRows.push(this.rawData[i])
    } else {
      for (let i = 0; i < this.rawData.length; i++) {
        this.viewRows.push(this.rawData[i])
      }
    }

    this.currentPage = 1
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
    return this.currentPage
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
    return Math.ceil(this.viewRows.length / this.pageSize)
  }

  public getCurrentPageRows() {
    const total = this.getTotalPages()
    if (this.currentPage > total) this.currentPage = 1
    const start = (this.currentPage - 1) * this.pageSize
    return this.viewRows.slice(start, start + this.pageSize)
  }

  private normalize(val: unknown): string {
    return String(val ?? '').toLowerCase()
  }

  private buildIndexIfMissing(column: THeader[number]) {
    if (this.indexedValues.has(column)) return

    const colIndex = new Map<string, Set<number>>()

    for (let i = 0; i < this.rawData.length; i++) {
      const val = this.normalize(this.rawData[i][column as keyof (typeof this.rawData)[number]])
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

  private addNormalized(row: DuckTableOptions<THeader>['data'][number]): NormalizedRow<typeof row> {
    const normalized: Record<string, string> = {}
    for (const key of Object.keys(this.headers)) {
      const val = row[key as keyof typeof row]
      normalized[key] = typeof val === 'string' ? val.toLowerCase() : String(val ?? '').toLowerCase()
    }
    return { ...row, _normalized: normalized }
  }

  private clearArray<T>(arr: T[]): void {
    arr.length = 0
  }

  public getSnapshot(): DuckTableOptions<THeader> {
    return {
      version: DuckTable.CURRENT_SNAPSHOT_VERSION,
      query: this.query,
      selectedRows: [...this.selectedRows],
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      sortConfig: JSON.parse(JSON.stringify(this.sortConfig)),
      visibleColumns: [...this.visibleColumns],
      data: this.rawData,
      headers: this.headers,
    }
  }

  public hydrate(snapshot: DuckTableOptions<THeader>): void {
    if (snapshot.query) {
      this.query = snapshot.query
    }
    if (snapshot.selectedRows) {
      this.selectedRows = [...snapshot.selectedRows]
    }
    if (snapshot.currentPage) {
      this.currentPage = snapshot.currentPage
    }
    if (snapshot.data) {
      this.rawData = snapshot.data
    }
    if (snapshot.headers) {
      this.headers = snapshot.headers
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
