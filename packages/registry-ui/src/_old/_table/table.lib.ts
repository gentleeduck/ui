// @ts-noCheck
import { DropdownMenuOptionsDataType } from '@/registry/default/ui/dropdown-menu'
import { Order, TableHeaderType } from './table.types'
import { ColumnsViewedStateType, TableContentDataType } from './table-advanced.types'

export function sortArray<T>(columns: TableHeaderType[], array: T[], key?: keyof T, order: Order = 'desc') {
  const toggleSortOrder = (currentOrder: Order): Order => {
    if (currentOrder === 'not sorted') return order
    if (currentOrder === 'asc' && order === 'asc') return 'not sorted'
    if (currentOrder === 'asc' && order === 'desc') return 'desc'
    if (currentOrder === 'desc' && order === 'desc') return 'not sorted'
    if (currentOrder === 'desc' && order === 'asc') return 'asc'
    return 'not sorted'
  }

  const updatedColumns = columns.map((col) => {
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

export type OptionsDataType<T extends Record<string, unknown>> = {
  header: ColumnsViewedStateType<T>[]
  columnsViewed?: ColumnsViewedStateType<T>[]
  setColumnsViewed?: React.Dispatch<React.SetStateAction<ColumnsViewedStateType<T>[]>>
}

export function get_options_data<T extends Record<string, unknown> = Record<string, string>>({
  header,
  columnsViewed,
  setColumnsViewed,
}: OptionsDataType<T>) {
  return header.map((column, idx) => {
    const { children, className, label, sortable, disabled, currentSort, dropdownMenuOptions, ...props } = column ?? {}

    return {
      checked: columnsViewed?.some((headerItem) => headerItem?.label === label),
      children: label ?? children,
      className: 'capitalize',
      disabled: disabled,
      key: idx,
      onCheckedChange: () => {
        setColumnsViewed?.((prevHeaders) => {
          const exists = prevHeaders.some((headerItem) => headerItem?.label === label)

          if (exists) {
            return prevHeaders.filter((headerItem) => headerItem?.label !== label)
          }

          const originalIndex = header.findIndex((headerItem) => headerItem?.label === label)
          const newHeaders = [...prevHeaders]
          newHeaders.splice(originalIndex, 0, column)
          return newHeaders.sort(
            (a, b) =>
              header.findIndex((headerItem) => headerItem?.label === a?.label) -
              header.findIndex((headerItem) => headerItem?.label === b?.label),
          )
        })
      },
      ...props,
    }
  }) as DropdownMenuOptionsDataType<T>[]
}
