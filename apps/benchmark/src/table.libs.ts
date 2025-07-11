import { DuckTableColumnSort, DuckTableFilterFn, DuckTableOptions, DuckTableRow } from './table.types'

const DEFAULT_PAGE_SIZE = 5
const DEFAULT_CURRENT_PAGE = 1

export class DuckTable<THeader extends string[]> {
  private headers: DuckTableOptions<THeader>['headers'] = {} as never
  private visibleColumns: (keyof DuckTableOptions<THeader>['headers'])[] = []
  private rawData: DuckTableOptions<THeader>['data'] = []
  private query = ''
  // private filteredData: DuckTableOptions<T>['data'] = []

  // private currentPage = DEFAULT_CURRENT_PAGE
  // private pageSize = DEFAULT_PAGE_SIZE
  // private sortConfig: DuckTableColumnSort<T>[] = []
  // private filters: DuckTableFilterFn<T>[] = []

  constructor(options: DuckTableOptions<THeader>) {
    this.headers = options.headers
    this.rawData = options.data
    this.query = options.query ?? ''
    this.visibleColumns = Object.keys(options.headers).filter(
      (key) => options.headers[key as keyof DuckTableOptions<THeader>['headers']].visible === true,
    )
    // this.filteredData = options.data
    // this.pageSize = options.pageSize || DEFAULT_PAGE_SIZE
    // this.sortConfig = options.sort || []
  }

  // Columns
  getColumns(): DuckTableOptions<THeader>['headers'] {
    return this.headers
  }

  getVisibleColumns(): (keyof DuckTableOptions<THeader>['headers'])[] {
    return this.visibleColumns
  }

  // --- 📄 Data Management ---
  getRows(): DuckTableOptions<THeader>['data'] {
    console.log('getRawData', this.rawData)
    return this.rawData
  }

  setRows(data: DuckTableOptions<THeader>['data']): void {
    this.rawData = data
  }

  // --- 🔎 Filtering & Sorting ---
  getQuery(): string {
    return this.query
  }

  setQuery(query: string): void {
    this.query = query
  }
}
