export type DuckTableRow<T> = T & { id: string }

export type DuckTableSortDirection = 'asc' | 'desc'

export interface DuckTableColumnSort<T extends readonly string[]> {
  column: T[number]
  direction: DuckTableSortDirection
}

export type DuckTableFilterFn<T> = (row: DuckTableRow<T>) => boolean

/* ===================================================================== */
type HeaderValues = { value: string; visible: boolean }
export type DuckTableOptions<THeaders extends readonly string[]> = {
  headers: Record<THeaders[number], HeaderValues>
  data: Record<'id' | THeaders[number], string>[]
  pageSize?: number
  sort?: DuckTableColumnSort<THeaders>[]
  query?: string
}
