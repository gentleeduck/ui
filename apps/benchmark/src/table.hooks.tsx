import { atom, Setter } from '@gentleduck/state/primitive'
import { DuckTable } from './table.libs'
import { DuckTableColumnSort, DuckTableOptions } from './table.types'

export function createDuckTable<THeaders extends Lowercase<string>[]>(initialData: DuckTableOptions<THeaders>) {
  const table = new DuckTable<THeaders>(initialData)

  // Atoms
  const rows = atom(table.getRows())
  const query = atom(
    () => table.getQuery(),
    (_, set, newQuery: string) => {
      table.setQuery(newQuery)
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
    (_, set, newPage: (value: number) => number | number) => {
      if (typeof newPage !== 'function') {
        table.setCurrentPage(newPage)
      } else {
        table.setCurrentPage(newPage(table.getCurrentPage()))
      }
      set(currentPageRows, table.getCurrentPageRows())
    },
  )

  const columns = atom(table.getColumns())
  const columnSort = atom(
    () => table.getColumnSort(),
    (_, set, newColumnSort: DuckTableColumnSort[] | ((value: DuckTableColumnSort[]) => DuckTableColumnSort[])) => {
      if (typeof newColumnSort === 'function') {
        table.setColumnSort(newColumnSort(table.getColumnSort()))
      } else {
        table.setColumnSort(newColumnSort)
      }
      set(mutatedRows, table.getMutatedRows())
      set(currentPageRows, table.getCurrentPageRows())
      console.log(table.getHistory(), table['sortCache'])
    },
  )
  const visibleColumns = atom(table.getVisibleColumns())
  const mutatedRows = atom(table.getMutatedRows())
  const currentPageRows = atom(table.getCurrentPageRows())
  const totalPages = atom(table.getTotalPages())
  const selectedRows = atom(table.getSelectedRows())

  // 🌐 Central sync function
  function syncAll(set: Setter) {
    set(mutatedRows, table.getMutatedRows())
    set(currentPageRows, table.getCurrentPageRows())
    set(totalPages, table.getTotalPages())
  }

  return {
    table,
    atoms: {
      columns,
      visibleColumns,
      columnSort,
      rows,
      mutatedRows,
      currentPageRows,
      currentPage,
      pageSize,
      query,
      totalPages,
      selectedRows,
    },
  }
}
