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

  private history: HistoryDelta[] = []
  private maxHistory = 20
  private versionCounter = 0
  private currentVersionIndex = 0
  private lastStorageUpdate = 0

  private storageKey?: string
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

    this.sortConfig = Object.values(this.headers).map((h) => {
      const hv = h as HeaderValues & { direction?: HistoryDelta['type'] }
      return { label: hv.value, direction: hv.direction || 'none' }
    }) as DuckTableColumnSort[]

    this.storageKey = options.storageKey
    if (this.storageKey && this.isBrowser()) {
      this.loadFromStorage()
      this.watchStorageChanges()
    }

    this.pushHistory('init', {}, this.viewRows)
  }

  public updateRow(id: string, partial: Partial<DuckTableOptions<THeader>['data'][number]>): void {
    const index = this.rawData.findIndex((r) => r.id === id)
    if (index === -1) throw new Error(`Row with id ${id} not found`)

    this.rawData[index] = { ...this.rawData[index], ...partial }
    this.reapplyView()
    this.pushHistory('edit', { id, changes: partial }, this.viewRows)
  }

  private reapplyView(): void {
    this.setQuery(this.query)
    this.setColumnSort(this.sortConfig)
  }

  public addRow(row: DuckTableOptions<THeader>['data'][number]): void {
    if (this.rawData.find((r) => r.id === row.id)) {
      throw new Error(`Row with id ${row.id} already exists`)
    }
    this.rawData.push(row)
    this.reapplyView()
    this.pushHistory('add', { id: row.id }, this.viewRows)
  }

  public deleteRow(id: string): void {
    this.rawData = this.rawData.filter((r) => r.id !== id)
    this.reapplyView()
    this.pushHistory('delete', { id }, this.viewRows)
  }

  /**
   * Subscribe to table events
   */
  public onTableChange(fn: (event: DuckTableEvent<THeader>) => void): void {
    this.changeListeners.push(fn)
  }

  public getCurrentVersion(): number {
    return this.history[this.currentVersionIndex]?.version ?? 0
  }

  public getTotalVersions(): number {
    return this.history.length
  }

  public getSnapshotIds(version: number): string[] | undefined {
    return this.history.find((h) => h.version === version)?.ids
  }

  public jumpToVersion(version: number): void {
    const entry = this.history.find((h) => h.version === version)
    if (!entry) throw new Error(`Version ${version} not found`)
    this.viewRows = this.resolveIdsToRows(entry.ids)
    this.currentVersionIndex = this.history.indexOf(entry)
    this.emitChange('jump', { version })
  }

  public undo(): void {
    if (this.currentVersionIndex > 0) {
      this.currentVersionIndex--
      const e = this.history[this.currentVersionIndex]
      this.viewRows = this.resolveIdsToRows(e.ids)
      this.emitChange('undo', { version: e.version })
    }
  }

  public redo(): void {
    if (this.currentVersionIndex < this.history.length - 1) {
      this.currentVersionIndex++
      const e = this.history[this.currentVersionIndex]
      this.viewRows = this.resolveIdsToRows(e.ids)
      this.emitChange('redo', { version: e.version })
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  }

  private saveToStorage(): void {
    if (!this.isBrowser() || !this.storageKey) return
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history))
    } catch {
      /* ignore */
    }
  }

  public loadFromStorage(): void {
    if (!this.isBrowser() || !this.storageKey) return

    try {
      const raw = localStorage.getItem(this.storageKey)
      if (!raw) return

      const saved = JSON.parse(raw) as HistoryDelta[]
      this.history = saved
      this.currentVersionIndex = saved.length - 1

      const last = saved[this.currentVersionIndex]
      if (!last) return

      this.viewRows = this.resolveIdsToRows(last.ids)
      this.lastStorageUpdate = last.timestamp

      // Apply query from meta if present
      if (last.meta && 'query' in last.meta) {
        this.query = last.meta.query
      }

      // Apply pagination if present
      if (last.meta && 'page' in last.meta) {
        this.currentPage = last.meta.page
      }

      if (last.meta && 'pageSize' in last.meta) {
        this.pageSize = last.meta.pageSize
      }

      // Apply sort config if present
      if (last.meta && 'sortConfig' in last.meta) {
        this.sortConfig = last.meta.sortConfig
      }
    } catch (err) {
      console.warn('[DuckTable] Failed to load from storage:', err)
      this.history = []
    }
  }

  private watchStorageChanges(): void {
    if (!this.storageKey || !this.isBrowser()) return
    window.addEventListener('storage', (e) => {
      if (e.key !== this.storageKey || !e.newValue) return
      try {
        const parsed = JSON.parse(e.newValue) as HistoryDelta[]
        const last = parsed.at(-1)
        if (!last || last.timestamp <= this.lastStorageUpdate) return
        const rows = this.resolveIdsToRows(last.ids)
        if (rows.length !== last.ids.length) return
        this.history = parsed
        this.viewRows = rows
        this.currentVersionIndex = parsed.length - 1
        this.lastStorageUpdate = last.timestamp
        this.emitChange('storage-sync', { version: last.version })
      } catch {
        /* ignore */
      }
    })
  }

  private pushHistory<T extends DuckTableEventType>(
    type: T,
    meta: DuckTableEventMeta<T, THeader>,
    rows: DuckTableOptions<THeader>['data'],
  ): void {
    const ids = rows.map((r) => r.id)
    const delta: HistoryDelta = {
      version: ++this.versionCounter,
      type,
      timestamp: Date.now(),
      ids,
      meta,
    }
    this.history.push(delta)

    if (this.history.length > this.maxHistory) {
      const removed = this.history.splice(0, this.history.length - this.maxHistory)
      this.versionCounter = this.history[this.history.length - 1].version
      this.currentVersionIndex = this.history.length - 1
      this.emitChange('compress', { removed })
    } else {
      this.currentVersionIndex = this.history.length - 1
    }

    this.lastStorageUpdate = delta.timestamp
    this.saveToStorage()
    this.emitChange(type, meta)
  }

  public setMaxHistory(limit: number): void {
    this.maxHistory = limit
  }

  public getHistory(): HistoryDelta[] {
    return [...this.history]
  }

  private assertUniqueIds(rows: DuckTableOptions<THeader>['data']): void {
    const seen = new Set<string>()
    for (const r of rows) {
      if (seen.has(r.id)) throw new Error(`Duplicate ID: ${r.id}`)
      seen.add(r.id)
    }
  }

  private resolveIdsToRows(ids: string[]): DuckTableOptions<THeader>['data'] {
    const map = new Map(this.rawData.map((r) => [r.id, r]))
    return ids.map((id) => map.get(id)!).filter(Boolean)
  }

  private emitChange<T extends DuckTableEventType>(type: T, meta: DuckTableEventMeta<T, THeader>): void {
    const event = { type, meta } as DuckTableEvent<THeader>
    for (const listener of this.changeListeners) {
      listener(event)
    }

    if (this.debug) console.debug(`[DuckTable] ${type}`, meta)

    const changeTypes: DuckTableEventType[] = ['sort', 'filter', 'page']
    if (!changeTypes.includes(type)) return

    const delta = this.history[this.currentVersionIndex]
    if (!delta) return
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
    const key = JSON.stringify(active)

    if (this.sortCache.has(key)) {
      this.viewRows = this.sortCache.get(key)!.map((i) => this.rawData[i])
      this.pushHistory('sort', { cached: true, sortConfig: active }, this.viewRows)
      return
    }

    if (active.length === 0) {
      this.viewRows = [...this.rawData]
      this.pushHistory('sort', { cached: false, sortConfig: [] }, this.viewRows)
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
    this.pushHistory('sort', { cached: false, sortConfig: active }, this.viewRows)

    console.log(this.history, this.sortCache)
  }

  public getRows() {
    return this.rawData
  }

  public resetRows(data: DuckTableOptions<THeader>['data']): void {
    this.assertUniqueIds(data)
    this.rawData = data
    this.viewRows = data.slice()
    this.sortCache.clear()
    this.pushHistory('filter', { reason: 'reset' }, this.viewRows)
  }

  public getMutatedRows() {
    return this.viewRows
  }

  public getQuery() {
    return this.query
  }

  public setQuery(query: Partial<Record<THeader[number], string>> | string): void {
    this.query = query

    this.viewRows = this.rawData.filter((row) => {
      if (typeof query === 'string') {
        // Global filter: matches any visible field
        return Object.keys(row).some((k) => {
          const h = this.headers[k as keyof typeof this.headers] as HeaderValues
          return h?.filterFn
            ? h.filterFn(row, query)
            : String(row[k as keyof typeof row] ?? '')
                .toLowerCase()
                .includes(query.toLowerCase())
        })
      } else if (typeof query === 'object' && query !== null) {
        // Advanced filter: match all specified columns
        return Object.entries(query).every(([col, q]) => {
          if (!q) return true
          const val = String(row[col as keyof typeof row] ?? '')
          return val.toLowerCase().includes((q as string).toLowerCase())
        })
      }

      return true // fallback if query is null/undefined
    })

    this.currentPage = 1
    this.pushHistory('filter', { query }, this.viewRows)
  }

  public getSelectedRows() {
    return this.selectedRows
  }

  public setSelectedRows(ids: string[]): void {
    this.selectedRows = ids
  }

  public getCurrentPage(): number {
    return this.currentPage
  }

  public getPageSize(): number {
    return this.pageSize
  }

  public setCurrentPage(page: number): void {
    this.currentPage = page
    this.pushHistory('page', { page }, this.viewRows)
  }

  public setPageSize(size: number): void {
    this.pageSize = size
    this.currentPage = 1
    this.pushHistory('page', { pageSize: size }, this.viewRows)
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
}
