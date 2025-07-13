import { atom, Setter } from '@gentleduck/state/primitive'
import { DuckTable } from './table.libs'
import { DuckTableColumnSort, DuckTableOptions } from './table.types'

export function createDuckTable<THeaders extends Lowercase<string>[]>(initialData: DuckTableOptions<THeaders>) {
  const table = new DuckTable<THeaders>(initialData)

  // Data atoms
  const rows = atom(table.getRows())
  const columns = atom(table.getColumns())
  const visibleColumns = atom(
    () => table.getVisibleColumns(),
    (_, set, column: DuckTableOptions<THeaders>['columns'][keyof DuckTableOptions<THeaders>['columns']]['label']) => {
      // console.log(column)
      table.toggleColumnVisibility(column)
      set(columns, () => table.getColumns())
      // console.log(table.getColumns())
      syncAll(set)
    },
  )
  const mutatedRows = atom(table.getMutatedRows())
  const currentPageRows = atom(table.getCurrentPageRows())
  const totalPages = atom(table.getTotalPages())
  const selectedRows = atom(
    () => table.getSelectedRows(),
    (_, set, newIds: ((value: string[]) => string[]) | string[]) => {
      if (typeof newIds === 'function') {
        table.setSelectedRows(newIds(table.getSelectedRows()))
      } else {
        table.setSelectedRows(newIds)
      }
    },
  )

  // Derived setter atoms with full sync
  const query = atom(
    () => table.getQuery(),
    (_, set, newQuery: string) => {
      table.setQuery(newQuery)
      set(currentPage, () => table.getCurrentPage())
      syncAll(set)
    },
  )

  const pageSize = atom(
    () => table.getPageSize(),
    (_, set, newSize: number) => {
      table.setPageSize(newSize)
      syncAll(set)
    },
  )

  const currentPage = atom(
    () => table.getCurrentPage(),
    (_, set, newPage: ((value: number) => number) | number) => {
      const page = typeof newPage === 'function' ? newPage(table.getCurrentPage()) : newPage
      table.setCurrentPage(page)
      syncAll(set)
    },
  )

  const columnSort = atom(
    () => table.getColumnSort(),
    (_, set, newColumnSort: DuckTableColumnSort[] | ((value: DuckTableColumnSort[]) => DuckTableColumnSort[])) => {
      const sort = typeof newColumnSort === 'function' ? newColumnSort(table.getColumnSort()) : newColumnSort
      table.setColumnSort(sort)
      syncAll(set)
    },
  )

  // Central sync function
  function syncAll(set: Setter) {
    set(mutatedRows, table.getMutatedRows())
    set(currentPageRows, table.getCurrentPageRows())
    set(totalPages, table.getTotalPages())
    set(selectedRows, table.getSelectedRows())
  }

  return {
    table,
    atoms: {
      rows,
      columns,
      visibleColumns,
      mutatedRows,
      currentPageRows,
      totalPages,
      selectedRows,
      query,
      pageSize,
      currentPage,
      columnSort,
    },
  }
}
