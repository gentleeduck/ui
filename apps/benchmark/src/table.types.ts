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

export type HistoryDelta = {
  version: number
  type: DuckTableEventType
  timestamp: number
  ids: string[]
  meta: any
}
export type DuckTableEvent<THeader extends readonly Lowercase<string>[]> =
  | { type: 'init'; meta: {} }
  | { type: 'sort'; meta: { cached: boolean; sortConfig: DuckTableColumnSort[] } }
  | { type: 'filter'; meta: { query?: Partial<Record<THeader[number], string>> | string; reason?: string } }
  | { type: 'page'; meta: { page?: number; pageSize?: number } }
  | { type: 'jump'; meta: { version: number } }
  | { type: 'undo'; meta: { version: number } }
  | { type: 'redo'; meta: { version: number } }
  | { type: 'compress'; meta: { removed: HistoryDelta[] } }
  | { type: 'storage-sync'; meta: { version: number } }
  | { type: 'broadcast-sync'; meta: { version: number } }
  | { type: 'column-visibility'; meta: { label: keyof DuckTableOptions<THeader>['headers']; visible: boolean } }
  | { type: 'edit'; meta: { id: string; changes: Partial<Record<'id' | THeader[number], string>> } }
  | { type: 'add'; meta: { id: string } }
  | { type: 'delete'; meta: { id: string } }

export type DuckTableEventType = DuckTableEvent<any>['type']

export type DuckTableEventMeta<T extends DuckTableEventType, THeader extends readonly Lowercase<string>[]> = Extract<
  DuckTableEvent<THeader>,
  { type: T }
>['meta']
