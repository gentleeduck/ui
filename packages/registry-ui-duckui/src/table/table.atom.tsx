import { useSyncExternalStore } from 'react'
import { DuckTable } from './table.libs'
import { DuckTableChangeKey, DuckTableColumnSort, DuckTableFilterFn, DuckTableRow } from './table.types'

export type Subscriber = () => void

export function atom<T>(initial: T) {
  let value = initial
  const subs = new Set<Subscriber>()

  return {
    get: () => value,
    set: (next: T) => {
      if (next !== value) {
        value = next
        subs.forEach((cb) => cb())
      }
    },
    subscribe: (cb: Subscriber) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
  }
}

type Atom<T> = ReturnType<typeof atom<T>>

export function useAtomValue<T>(atom: Atom<T>) {
  return useSyncExternalStore(atom.subscribe, atom.get)
}

export function useSetAtom<T>(atom: Atom<T>) {
  return atom.set
}

export function useAtom<T>(atom: Atom<T>): [T, (next: T) => void] {
  const value = useAtomValue(atom)
  const set = useSetAtom(atom)
  return [value, set]
}

//
export function createDuckTable<T>(initialData: DuckTableRow<T>[]) {
  const table = new DuckTable<T>({ data: initialData })

  // 🧠 Atom stores
  const pageAtom = atom(table['currentPage'])
  const pageSizeAtom = atom(table.getPageSize())
  const rowsAtom = atom(table.getPage())
  const totalPagesAtom = atom(table.getTotalPages())
  const rawDataAtom = atom(table.getRawData())

  const selectedRowsAtom = atom(table.getSelectedRows())
  const expandedRowsAtom = atom(table.getExpandedRows())
  const visibleColumnsAtom = atom(table.getVisibleColumns())
  const filteredRowsAtom = atom(table['filteredData']) // useful for search
  const queryAtom = atom(table.getQuery()) // ⚡ search query

  // 🤩 Main sync routine
  const sync = (key: DuckTableChangeKey) => {
    if (key === 'page' || key === 'all') {
      pageAtom.set(table['currentPage'])
      rowsAtom.set(table.getPage())
      totalPagesAtom.set(table.getTotalPages())
      pageSizeAtom.set(table.getPageSize())
    }

    if (key === 'selection' || key === 'all') {
      selectedRowsAtom.set(table.getSelectedRows())
    }

    if (key === 'expansion' || key === 'all') {
      expandedRowsAtom.set(table.getExpandedRows())
    }

    if (key === 'columnVisibility' || key === 'all') {
      visibleColumnsAtom.set(table.getVisibleColumns())
    }

    if (key === 'filter' || key === 'all') {
      filteredRowsAtom.set(table['filteredData'])
      queryAtom.set(table.getQuery())
    }
  }

  // 🔁 Subscribe to all table changes
  table.onUpdate((key) => {
    sync(key)
  })

  // 🎮 Actions
  const actions = {
    // Paging
    firstPage: () => table.firstPage(),
    lastPage: () => table.lastPage(),
    nextPage: () => table.nextPage(),
    prevPage: () => table.prevPage(),
    setPage: (page: number) => table.setPage(page),

    // Page Size
    getPageSize: () => table.getPageSize(),
    setPageSize: (size: number) => table.setPageSize(size),

    // Selection
    toggleSelect: (id: string) => table.toggleSelect(id),

    // Expansion
    toggleExpand: (id: string) => table.toggleExpand(id),

    // Column visibility
    toggleColumn: (col: keyof T) => table.toggleColumnVisibility(col),
    isColumnVisible: (col: keyof T) => table.isColumnVisible(col),

    // Filters and sort
    setFilters: (filters: DuckTableFilterFn<T>[]) => table.setFilters(filters),
    setSort: (sort: DuckTableColumnSort<T>[]) => table.setSort(sort),

    // Search Query
    setQuery: (query: string) => table.setQuery(query),

    // Raw data update
    setData: (data: DuckTableRow<T>[]) => table.setData(data),

    // Exporting
    exportCSV: () => table.exportCSV(),
    exportJSON: () => table.exportJSON(),
  }

  return {
    table,
    atoms: {
      raw: rawDataAtom,
      page: pageAtom,
      pageSize: pageSizeAtom,
      rows: rowsAtom,
      totalPages: totalPagesAtom,
      selected: selectedRowsAtom,
      expanded: expandedRowsAtom,
      visibleColumns: visibleColumnsAtom,
      filteredRows: filteredRowsAtom,
      query: queryAtom,
    },
    actions,
  }
}
