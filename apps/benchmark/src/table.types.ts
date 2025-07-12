export type DuckTableColumnSort = { label: Lowercase<string>; direction: 'asc' | 'desc' | 'none' }
export type HeaderValues =
  | { value: Lowercase<string>; filterFn?: Function; visible: boolean; sortable: false }
  | {
      value: Lowercase<string>
      filterFn?: Function
      visible: boolean
      sortable: true
      direction: DuckTableColumnSort['direction']
    }
export type DuckTableOptions<THeaders extends readonly Lowercase<string>[]> = {
  headers: Record<THeaders[number], HeaderValues>
  data: Record<'id' | THeaders[number], string>[]
  pageSize?: number
  sort?: DuckTableColumnSort[]
  query?: string
  storageKey?: string
}
