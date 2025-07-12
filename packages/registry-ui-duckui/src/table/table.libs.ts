import {
  DuckTableChangeKey,
  DuckTableColumnSort,
  DuckTableFilterFn,
  DuckTableOptions,
  DuckTableRow,
  DuckTableType,
  Listener,
} from './table.types'

const DEFAULT_PAGE_SIZE = 5
const DEFAULT_CURRENT_PAGE = 1

export class DuckTable<T> implements DuckTableType<T> {
  private rawData: DuckTableRow<T>[] = []
  private filteredData: DuckTableRow<T>[] = []
  private sortedData: DuckTableRow<T>[] = []
  private query = ''

  private selectedIds = new Set<string>()
  private expandedIds = new Set<string>()

  private currentPage = DEFAULT_CURRENT_PAGE
  private pageSize = DEFAULT_PAGE_SIZE

  private sortConfig: DuckTableColumnSort<T>[] = []
  private filters: DuckTableFilterFn<T>[] = []

  private columnVisibility: Partial<Record<keyof T, boolean>> = {}
  private listeners: Listener[] = []

  constructor(options: DuckTableOptions<T>) {
    this.rawData = options.data
    this.filteredData = options.data
    this.pageSize = options.pageSize || DEFAULT_PAGE_SIZE
    this.sortConfig = options.initialSort || []
    this.applyAll()
  }

  // --- 🔁 State Management ---
  private notify(key: DuckTableChangeKey) {
    this.listeners.forEach((fn) => fn(key))
  }

  onUpdate(fn: Listener) {
    this.listeners.push(fn)
    return () => (this.listeners = this.listeners.filter((f) => f !== fn))
  }

  // --- 📄 Data Management ---
  getRawData(): DuckTableRow<T>[] {
    return this.rawData
  }

  setData(data: DuckTableRow<T>[]): void {
    this.rawData = data
    this.applyAll()
  }

  // --- 🔎 Filtering & Sorting ---
  getQuery(): string {
    return this.query
  }

  setQuery(query: string): void {
    this.query = query
    this.filteredData = this.rawData.filter((row) => JSON.stringify(row).includes(query))
    this.notify('filter')
  }

  setFilters(filters: DuckTableFilterFn<T>[]): void {
    this.filters = filters
    this.applyAll()
  }

  setSort(sort: DuckTableColumnSort<T>[]): void {
    this.sortConfig = sort
    this.applyAll()
  }

  private applyAll() {
    this.filteredData = this.applyFilters(this.rawData)
    this.sortedData = this.applySort(this.filteredData)
    this.currentPage = 1
    this.notify('all')
  }

  private applyFilters(data: DuckTableRow<T>[]): DuckTableRow<T>[] {
    if (!this.filters.length) return data
    return data.filter((row) => this.filters.every((fn) => fn(row)))
  }

  private applySort(data: DuckTableRow<T>[]): DuckTableRow<T>[] {
    if (!this.sortConfig.length) return [...data]
    return [...data].sort((a, b) => {
      for (const { column, direction } of this.sortConfig) {
        const aVal = a[column]
        const bVal = b[column]
        if (aVal === bVal) continue
        const result = aVal > bVal ? 1 : -1
        return direction === 'asc' ? result : -result
      }
      return 0
    })
  }

  // --- 📄 Pagination ---
  setPageSize(size: number): void {
    this.pageSize = size
    this.currentPage = 1
    this.notify('page')
    console.log(this.pageSize, 'this.pageSize')
  }

  getPageSize(): number {
    return this.pageSize
  }

  setPage(page: number): void {
    this.currentPage = page
    this.notify('page')
  }

  nextPage(): void {
    this.currentPage = Math.min(this.currentPage + 1, this.getTotalPages())
    this.notify('page')
  }

  prevPage(): void {
    this.currentPage = Math.max(this.currentPage - 1, 1)
    this.notify('page')
  }

  firstPage(): void {
    this.currentPage = 1
    this.notify('page')
  }

  lastPage(): void {
    this.currentPage = this.getTotalPages()
    this.notify('page')
  }

  getPage(): DuckTableRow<T>[] {
    const start = (this.currentPage - 1) * this.pageSize
    return this.sortedData.slice(start, start + this.pageSize)
  }

  getTotalPages(): number {
    return Math.ceil(this.sortedData.length / this.pageSize)
  }

  // --- ✅ Selection & Expansion ---
  toggleSelect(id: string): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id)
    } else {
      this.selectedIds.add(id)
    }
    this.notify('selection')
  }

  toggleExpand(id: string): void {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id)
    } else {
      this.expandedIds.add(id)
    }
    this.notify('expansion')
  }

  getSelectedRows(): DuckTableRow<T>[] {
    return this.rawData.filter((row) => this.selectedIds.has(row.id))
  }

  getExpandedRows(): DuckTableRow<T>[] {
    return this.rawData.filter((row) => this.expandedIds.has(row.id))
  }

  // --- 📊 Column Visibility ---
  toggleColumnVisibility(column: keyof T): void {
    this.columnVisibility[column] = !this.columnVisibility[column]
    this.notify('columnVisibility')
  }

  isColumnVisible(column: keyof T): boolean {
    return this.columnVisibility[column] !== false
  }

  getVisibleColumns(): (keyof T)[] {
    return Object.keys(this.rawData[0] || {}) as (keyof T)[]
  }

  // --- ⬇ Exporting ---
  exportCSV(): string {
    const columns = this.getVisibleColumns()
    const rows = this.rawData.map((row) => columns.map((col) => JSON.stringify(row[col])).join(','))
    return [columns.join(','), ...rows].join('\n')
  }

  exportJSON(): string {
    return JSON.stringify(this.rawData, null, 2)
  }
}
