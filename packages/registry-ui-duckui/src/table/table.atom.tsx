import { useSyncExternalStore } from 'react'
import { DuckTable } from './table.libs'
import { DuckTableRow } from './table.types'

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

export function useAtom<T>(atom: { get: () => T; subscribe: (cb: () => void) => () => void }) {
  return useSyncExternalStore(atom.subscribe, atom.get)
}

export function createDuckTable<T>(initialData: DuckTableRow<T>[]) {
  const table = new DuckTable<T>({ data: initialData })

  const pageAtom = atom(table['currentPage'])
  const pageSizeAtom = atom(3)
  const rowsAtom = atom(table.getPage())
  const totalPagesAtom = atom(table.getTotalPages())

  const selectedRowsAtom = atom(table.getSelectedRows())
  const visibleColumnsAtom = atom(table.getVisibleColumns())
  const filteredRowsAtom = atom(table['filteredData']) // optional

  // Sync function: Update table + atoms
  const sync = () => {
    rowsAtom.set(table.getPage())
    totalPagesAtom.set(table.getTotalPages())
    selectedRowsAtom.set(table.getSelectedRows())
    visibleColumnsAtom.set(table.getVisibleColumns())
  }

  // Subscribe to table changes
  table.onUpdate(() => {
    pageAtom.set(table['currentPage'])
    sync()
  })

  // Actions (update both table + atom if needed)
  const actions = {
    firstPage: () => table.firstPage(),
    lastPage: () => table.lastPage(),
    nextPage: () => table.nextPage(),
    prevPage: () => table.prevPage(),
    setPage: (page: number) => table.setPage(page),
    toggleSelect: (id: string) => table.toggleSelect(id),
    toggleColumn: (col: keyof T) => table.toggleColumnVisibility(col),
    setPageSize: (size: number) => table.setPageSize(size),
  }

  return {
    table,
    atoms: {
      page: pageAtom,
      rows: rowsAtom,
      pageSize: pageSizeAtom,
      totalPages: totalPagesAtom,
      selected: selectedRowsAtom,
      visibleColumns: visibleColumnsAtom,
      filteredRows: filteredRowsAtom,
    },
    actions,
  }
}
