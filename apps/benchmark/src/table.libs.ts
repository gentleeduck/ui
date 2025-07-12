import { DuckTableColumnSort, DuckTableOptions, HeaderValues } from './table.types'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_CURRENT_PAGE = 1

type HistoryDelta = {
  version: number
  type: 'init' | 'sort' | 'filter' | 'page'
  timestamp: number
  ids: string[]
  meta: any
}

export class DuckTable<THeader extends Lowercase<string>[]> {
  private headers: DuckTableOptions<THeader>['headers'] = {} as never
  private visibleColumns: (keyof DuckTableOptions<THeader>['headers'])[] = []
  private rawData: DuckTableOptions<THeader>['data'] = []
  private viewRows: DuckTableOptions<THeader>['data'] = []
  private selectedRows: DuckTableOptions<THeader>['data'][number]['id'][] = []
  private query = ''
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
  private broadcast?: BroadcastChannel
  private instanceId = Math.random().toString(36).slice(2)

  private debug = false

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
      this.broadcast = new BroadcastChannel(`duck-table:${this.storageKey}`)
      this.broadcast.onmessage = this.handleBroadcast
      this.loadFromStorage()
      this.watchStorageChanges()
    }

    this.pushHistory('init', {}, this.viewRows)
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

  private loadFromStorage(): void {
    if (!this.isBrowser() || !this.storageKey) return
    try {
      const raw = localStorage.getItem(this.storageKey)
      if (!raw) return
      const saved = JSON.parse(raw) as HistoryDelta[]
      this.history = saved
      this.currentVersionIndex = saved.length - 1
      const last = saved[this.currentVersionIndex]
      if (last) {
        this.viewRows = this.resolveIdsToRows(last.ids)
        this.lastStorageUpdate = last.timestamp
      }
    } catch {
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

  private handleBroadcast = (evt: MessageEvent) => {
    const msg = evt.data as any
    if (!msg || msg.instanceId === this.instanceId) return
    if (msg.type !== 'history-update') return
    if (msg.timestamp <= this.lastStorageUpdate) return
    const rows = this.resolveIdsToRows(msg.ids)
    if (rows.length !== msg.ids.length) return
    this.history.push({
      version: msg.version,
      type: msg.entryType,
      timestamp: msg.timestamp,
      ids: msg.ids,
      meta: msg.meta,
    })
    this.viewRows = rows
    this.currentVersionIndex = this.history.length - 1
    this.lastStorageUpdate = msg.timestamp
    this.emitChange('broadcast-sync', { version: msg.version })
  }

  private pushHistory(type: HistoryDelta['type'], meta: any, rows: DuckTableOptions<THeader>['data']): void {
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

  private emitChange(type: string, meta: any): void {
    if (this.debug) console.debug(`[DuckTable] ${type}`, meta)

    const changeTypes = ['sort', 'filter', 'page']
    if (!changeTypes.includes(type)) return

    const delta = this.history[this.currentVersionIndex]
    if (!delta || !this.broadcast) return

    this.broadcast.postMessage({
      type: 'history-update',
      entryType: type,
      version: delta.version,
      ids: delta.ids,
      meta: delta.meta,
      timestamp: delta.timestamp,
      instanceId: this.instanceId,
    })
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

  public setQuery(q: string): void {
    this.query = q
    this.viewRows = this.rawData.filter((row) =>
      Object.keys(row).some((k) => {
        const h = this.headers[k as keyof THeader] as HeaderValues
        return h.filterFn
          ? h.filterFn(row, q)
          : String(row[k as keyof typeof row])
              .toLowerCase()
              .includes(q.toLowerCase())
      }),
    )
    this.currentPage = 1
    this.pushHistory('filter', { query: q }, this.viewRows)
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
