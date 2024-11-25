import { TableContentDataType } from './table'
import { Order, TableHeaderType } from './table.types'

export function sortArray<T>(columns: TableHeaderType[], array: T[], key?: keyof T, order: Order = 'desc') {
  const toggleSortOrder = (currentOrder: Order): Order => {
    if (currentOrder === 'not sorted') return order
    if (currentOrder === 'asc' && order === 'asc') return 'not sorted'
    if (currentOrder === 'asc' && order === 'desc') return 'desc'
    if (currentOrder === 'desc' && order === 'desc') return 'not sorted'
    if (currentOrder === 'desc' && order === 'asc') return 'asc'
    return 'not sorted'
  }

  const updatedColumns = columns.map(col => {
    if (col.label === key) {
      return {
        ...col,
        currentSort: toggleSortOrder(col.currentSort ?? 'not sorted'),
      }
    }
    return col
  })

  const sortedData = array.toSorted((a, b) => {
    const valueA = key ? (a[key] as TableContentDataType).children : a
    const valueB = key ? (b[key] as TableContentDataType).children : b

    if (order === 'not sorted' || !key) return 0

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
      return order === 'asc' ? valueA - valueB : valueB - valueA
    } else {
      return order === 'asc' ? (valueA > valueB ? 1 : -1) : valueA < valueB ? 1 : -1
    }
  })

  return { sortedData, updatedColumns }
}
