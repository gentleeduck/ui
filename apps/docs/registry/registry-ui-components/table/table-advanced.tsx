import React from 'react'
import { cn } from '@/lib'
import {
  DuckTableContextType,
  DuckTableProps,
  DuckTableProviderProps,
  TableSearchStateType,
} from './table-advanced.types'
import { Table } from './table'
import { ScrollArea, ScrollBar } from '@/registry/default/ui/scroll-area'
import { TableDropdownMenuOptionsType, TableHeaderType } from './table.types'
import {
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/default/ui/ShadcnUI/table'
import { Checkbox } from '@/registry/default/ui/checkbox'
import {
  DropdownMenuOptionsDataType,
  DropdownMenuView,
} from '@/registry/default/ui/dropdown-menu'
import { ArrowDownIcon, ArrowUpIcon, LucideIcon } from 'lucide-react'
import { CaretSortIcon } from '@radix-ui/react-icons'

export const DuckTableContext =
  React.createContext<DuckTableContextType<any> | null>(null)

export function useDuckTable() {
  const context = React.useContext(DuckTableContext)
  if (!context) {
    throw new Error('useTableProvider must be used within an TableProvider')
  }
  return context
}

export function DuckTableProvider<TColumnName extends string[]>({
  table_rows,
  table_columns,
  children,
  className,
  ...props
}: DuckTableProviderProps<TColumnName>) {
  const [search, setSearch] = React.useState<TableSearchStateType>({
    query: '',
    queryBy: [],
  })

  return (
    <DuckTableContext.Provider
      value={{
        table_columns,
        table_rows,
        search,
        setSearch,
      }}
    >
      <div
        className={cn(
          `w-full- flex flex-col gap-4 w-[800px] h-[500px]`,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </DuckTableContext.Provider>
  )
}
DuckTableProvider.displayName = 'DuckTableProvider'

export function DuckTable({
  wrapper,
  className,
  children,
  ...props
}: DuckTableProps) {
  const { className: wrapperClassName, ...wrapperProps } = wrapper! ?? {}

  return (
    <ScrollArea
      className={cn(
        'border border-border rounded-lg !overflow-visible relative',
        wrapperClassName,
      )}
      {...wrapperProps}
    >
      <Table {...props}>{children}</Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
DuckTable.displayName = 'DuckTable'

// ------------------------------------------------------------------------------------------------

export interface DuckTableHeaderProps {}

export function DuckTableHeader({}: DuckTableHeaderProps) {
  const { table_columns } = useDuckTable()
  return (
    <>
      <TableHeader>
        <TableRow>
          {table_columns?.map((column, idx) => {
            const {
              children,
              className,
              sortable,
              label,
              showLabel,
              dropdownMenuOptions,
              currentSort,
              ...props
            } = column

            // const actionsArgs = {
            //   sortArray,
            //   setTableData,
            //   setHeaders,
            //   column,
            //   idx,
            //   data: tableData,
            //   headers,
            //   tableData,
            // } as unknown as TableDropdownMenuOptionsType<C>

            //NOTE: passing the actionsArgs to the onClick function
            const fullDropDownMenuOptions = dropdownMenuOptions?.map((item) => {
              return {
                ...item,
                onClick: (
                  e:
                    | React.MouseEvent<HTMLButtonElement>
                    | React.MouseEvent<HTMLDivElement>,
                ) => {
                  // item.action?.(e, actionsArgs)
                },
              }
            })

            return (
              <React.Fragment key={idx}>
                {idx === 0 && (
                  <TableHead
                    className={cn(
                      'flex items-center w-full data-[state=open]:bg-accent text-xs capitalize h-[51px] py-2',
                      dropdownMenuOptions?.length && 'justify-end',
                    )}
                    {...props}
                  >
                    {
                      //selectable && (
                      <Checkbox
                        className="border-border"
                        // onClick={() =>
                        //   // setSelected(selected.length === tableData.length ? [] : tableData.map(item => item)
                        //               // )
                        // }
                        // checked={
                        //   //   // selected.length === tableData.length
                        //   //   //   ? true
                        //   //   //   : selected.length < tableData.length && selected.length
                        //   //   //     ? 'indeterminate'
                        //   //   //     : false
                        // }
                      />
                    }
                  </TableHead>
                )}
                <TableHead
                  className={cn('py-2', sortable && 'px-2', className)}
                  {...props}
                >
                  {/*NOTE: Rendering Sorting else rendering label*/}
                  {!sortable ? (
                    <span className="capitalize">
                      {(label as string) ?? children}
                    </span>
                  ) : (
                    <div className={cn('flex items-center space-x-2')}>
                      {(dropdownMenuOptions?.length ?? 0) > 0 && (
                        <DropdownMenuView
                          trigger={{
                            size: 'sm',
                            variant: 'ghost',
                            className:
                              'data-[state=open]:bg-accent [&>div]:justify-between w-full [&>div]:w-full capitalize',
                            secondIcon: {
                              className: '-ml-3',
                              children: (column?.currentSort === 'asc'
                                ? ArrowDownIcon
                                : column?.currentSort === 'desc'
                                  ? ArrowUpIcon
                                  : CaretSortIcon) as LucideIcon,
                            },
                            children: (label as string) ?? children,
                            label: showLabel
                              ? {
                                  children: label.toString() + ' options',
                                  className: 'capitalize',
                                  showLabel: true,
                                  side: 'top',
                                }
                              : undefined,
                          }}
                          content={{
                            align: 'center',
                            options: {
                              group: [2, 1],
                              optionsData: fullDropDownMenuOptions as
                                | DropdownMenuOptionsDataType<
                                    TableDropdownMenuOptionsType<T, C>
                                  >[]
                                | undefined,
                            },
                          }}
                        />
                      )}
                    </div>
                  )}
                </TableHead>
              </React.Fragment>
            )
          })}
        </TableRow>
      </TableHeader>
    </>
  )
}
DuckTableHeader.displayName = 'TableCustomViewHeader'
