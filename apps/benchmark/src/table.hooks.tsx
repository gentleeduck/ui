import { atom } from '@gentleduck/state/primitive'
import { DuckTable } from './table.libs'
import { DuckTableOptions } from './table.types'

export function createDuckTable<THeaders extends string[]>(initialData: DuckTableOptions<THeaders>) {
  const table = new DuckTable<THeaders>(initialData)

  // const pageSize = atom(table.getPageSize())
  const rows = atom(table.getRows())
  const query = atom(table.getQuery())
  const columns = atom(table.getColumns())
  const visibleColumns = atom(table.getVisibleColumns())

  return {
    table,
    atoms: {
      visibleColumns,
      columns,
      rows,
      // pageSize,
      query,
    } as const,
  }
}
