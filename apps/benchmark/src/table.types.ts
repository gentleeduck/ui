export type DuckTableRow<T> = T & { id: string }

export type DuckTableSortDirection = 'asc' | 'desc'

export type DuckTableFilterFn<T> = (row: DuckTableRow<T>) => boolean

/* ===================================================================== */
export type DuckTableColumnSort = { label: string; direction: 'asc' | 'desc' | 'none' }
export type HeaderValues =
  | { value: string; visible: boolean; sortable: false }
  | { value: string; visible: boolean; sortable: true; sortDirection: DuckTableColumnSort['direction'] }
export type DuckTableOptions<THeaders extends readonly string[]> = {
  headers: Record<THeaders[number], HeaderValues>
  data: Record<'id' | THeaders[number], string>[]
  pageSize?: number
  sort?: DuckTableColumnSort[]
  query?: string
}
