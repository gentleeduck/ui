import { DuckTableColumnSort, DuckTableFilterFn, DuckTableOptions, DuckTableRow, HeaderValues } from './table.types'

const DEFAULT_PAGE_SIZE = 3
const DEFAULT_CURRENT_PAGE = 1

export class DuckTable<THeader extends string[]> {
  private headers: DuckTableOptions<THeader>['headers'] = {} as never
  private visibleColumns: (keyof DuckTableOptions<THeader>['headers'])[] = []
  private rawData: DuckTableOptions<THeader>['data'] = []
  private mutatedRows: DuckTableOptions<THeader>['data'] = []
  private selectedRows: DuckTableOptions<THeader>['data'][number]['id'][] = []
  private query = ''

  private currentPage = DEFAULT_CURRENT_PAGE
  private pageSize = DEFAULT_PAGE_SIZE
  private sortConfig: DuckTableColumnSort[] = []
  // private filters: DuckTableFilterFn<T>[] = []

  constructor(options: DuckTableOptions<THeader>) {
    this.headers = options.headers
    this.rawData = options.data
    this.mutatedRows = options.data
    this.query = options.query ?? ''
    this.visibleColumns = Object.keys(options.headers).filter(
      (key) => options.headers[key as keyof DuckTableOptions<THeader>['headers']].visible === true,
    )
    // this.filteredData = options.data
    // this.pageSize = options.pageSize || DEFAULT_PAGE_SIZE
    // this.sortConfig = options.sort || []
  }

  // Columns
  public getColumns(): DuckTableOptions<THeader>['headers'] {
    return this.headers
  }

  public getVisibleColumns(): (keyof DuckTableOptions<THeader>['headers'])[] {
    return this.visibleColumns
  }

  public getSortConfig(): DuckTableColumnSort[] {
    return this.sortConfig
  }

  public setSortConfig(sortConfig: DuckTableColumnSort[]) {
    console.log('setColumnSort', sortConfig)
    this.sortConfig = sortConfig
  }

  // --- 📄 Data Management ---
  public getRows(): DuckTableOptions<THeader>['data'] {
    console.log('getRawData', this.rawData)
    return this.rawData
  }

  public setRows(data: DuckTableOptions<THeader>['data']) {
    this.rawData = data
  }

  public getCurrentPageRows(): DuckTableOptions<THeader>['data'] {
    const start = (this.currentPage - 1) * this.pageSize
    console.log(start, start + this.pageSize)
    return this.mutatedRows.slice(start, start + this.pageSize)
  }

  /* =============================================================== */
  // --- 🔎 Filtering & Sorting ---
  public getMutatedRows(): DuckTableOptions<THeader>['data'] {
    return this.mutatedRows
  }

  public seMutatedRows() {
    this.mutatedRows = this.rawData.filter((invoice) =>
      JSON.stringify(invoice).toLowerCase().includes(this.query.toLowerCase()),
    )
  }
  /* =============================================================== */

  public getQuery(): string {
    return this.query
  }

  public setQuery(query: string) {
    this.query = query
    this.seMutatedRows()
  }
  /* =============================================================== */

  public getSelectedRows(): DuckTableOptions<THeader>['data'][number]['id'][] {
    return this.selectedRows
  }

  public setSelectedRows(ids: DuckTableOptions<THeader>['data'][number]['id'][]) {
    this.selectedRows = ids
  }

  /* =============================================================== */
  // --- 📊 Pagination ---
  public getCurrentPage(): number {
    return this.currentPage
  }

  public setCurrentPage(page: number) {
    this.currentPage = page
  }

  public getPageSize(): number {
    return this.pageSize
  }

  public setPageSize(size: number) {
    this.pageSize = size
  }

  public getTotalPages(): number {
    return Math.ceil(this.mutatedRows.length / this.pageSize)
  }
}
