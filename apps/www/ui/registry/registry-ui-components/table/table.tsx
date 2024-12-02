import * as React from 'react'

import { cn } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpIcon, CirclePlus, Ellipsis } from 'lucide-react'
import { CaretSortIcon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Checkbox } from '@/registry/default/ui/checkbox'
import { ScrollArea, ScrollBar } from '@/registry/default/ui/scroll-area'
import { PaginationCustomView } from '@/registry/default/ui/pagination'
import { Input } from '@/registry/default/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'
import { Combobox, type ComboboxType } from '@/registry/default/ui/combobox'
import { CommandShortcut, type CommandListGroupDataType } from '@/registry/default/ui/command'
import { type DropdownMenuOptionsDataType, DropdownMenuView } from '@/registry/default/ui/dropdown-menu'
import { Badge } from '../badge'
import { ContextCustomView, DuckContextMenuProps } from '@/registry/default/ui/context-menu'
import { useDebounceCallback } from '@/hooks'
import {
  TableContentDataType,
  TableCustomBodyProps,
  TableDataFilteredType,
  TableDropdownMenuOptionsType,
  TableFooterProps,
  TableHeaderActionsProps,
  TableHeaderType,
  TablePaginationType,
} from './table.types'
import { get_options_data, sortArray } from './table.lib'
import { unknown } from 'zod'
import { PAGE_INDEX, PAGE_SIZE } from './table.constants'
import { useDuckTable } from './table.hook'
import { LabelType } from '../button'
import { useDuckShortcut } from '@ahmedayob/duck-shortcut'
import { toast } from 'sonner'

/*
 *  - This's the normal table components.
 *  It's a custom table component, you can use the dataTable Functionality down
 *  this file to make sure you get the best performance, out of this table with
 *  a more customized design.
 */
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  )
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
)
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
)
TableCaption.displayName = 'TableCaption'

/*
 *  - From this point to the rest of the files are the components for the data table lib we made it's
 *  totally customizable, if you don't like something about this lib you can change it.
 *  - It's totally type safe and easy to use.
 */

export type DuckTableContextType<Column extends Record<string, unknown>> = {
  pagination: TablePaginationStateType
  setPagination: React.Dispatch<React.SetStateAction<TablePaginationStateType>>
  selection: TableSelectionStateType
  setSelection: React.Dispatch<React.SetStateAction<TableSelectionStateType>>
  search: TableSearchStateType
  setSearch: React.Dispatch<React.SetStateAction<TableSearchStateType>>
  columnsViewed: ColumnsViewedStateType<Column>[] | undefined
  setColumnsViewed: React.Dispatch<React.SetStateAction<ColumnsViewedStateType<Column>[]>> | undefined
  order: OrderStateType[]
  setOrder: React.Dispatch<React.SetStateAction<OrderStateType[]>>
  filterBy: FilterByType
  setFilterBy: React.Dispatch<React.SetStateAction<FilterByType>>
}

export const DuckTableContext = React.createContext<DuckTableContextType<any> | null>(null)

export interface DuckTableProviderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface TablePaginationStateType {
  pageSize: number
  pageIndex: number
}

export type FilterByType = string[]

export interface TableSelectionStateType {
  rowSelected: Record<string, unknown>[]
}

export interface TableSearchStateType {
  query: string
}
export type ColumnsViewedStateType<T extends Record<string, unknown>> = TableHeaderType<T> | null

export type OrderStateType = {
  orderBy: string
  orderDir: 'asc' | 'desc'
}

export const DuckTableProvider = <Column extends Record<string, unknown>>({
  children,
  className,
  ...props
}: DuckTableProviderProps) => {
  const [pagination, setPagination] = React.useState<TablePaginationStateType>({
    pageSize: PAGE_SIZE,
    pageIndex: PAGE_INDEX,
  })

  const [selection, setSelection] = React.useState<TableSelectionStateType>({
    rowSelected: [],
  })

  const [search, setSearch] = React.useState<TableSearchStateType>({
    query: '',
  })

  const [filterBy, setFilterBy] = React.useState<FilterByType>([])

  const [columnsViewed, setColumnsViewed] = React.useState<ColumnsViewedStateType<Column> | never[]>([])

  const [order, setOrder] = React.useState<OrderStateType[]>([])
  console.log(search)
  return (
    <DuckTableContext.Provider
      value={{
        pagination,
        setPagination,
        selection,
        setSelection,
        search,
        setSearch,
        columnsViewed: columnsViewed as ColumnsViewedStateType<Column>[],
        setColumnsViewed: setColumnsViewed as React.Dispatch<React.SetStateAction<ColumnsViewedStateType<Column>[]>>,
        order,
        setOrder,
        filterBy,
        setFilterBy,
      }}
    >
      <div
        className={cn(`w-full flex flex-col gap-4`, className)}
        {...props}
      >
        {children}
      </div>
    </DuckTableContext.Provider>
  )
}

export const DuckTableBar = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('flex items-end lg:items-center justify-between gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface DuckTableSearchProps extends React.HTMLProps<HTMLDivElement> {
  input?: DuckTableSearchInputProps
}

export const DuckTableSearch = ({ children, className, input, ...props }: DuckTableSearchProps) => {
  const { setSearch } = useDuckTable() ?? {}

  //NOTE: Debounce search
  const debouncedSearch = useDebounceCallback((newValue: string) => {
    setSearch?.(prev => ({
      ...prev,
      q: newValue,
    }))
  }, 500)

  return (
    <div
      className={cn('flex flex-1 items-center space-x-2', className)}
      {...props}
    >
      <DuckTableSearchInput
        {...input}
        trigger={{
          ...input?.trigger,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => debouncedSearch(event.target.value),
        }}
      />
    </div>
  )
}

export interface DuckTableSearchInputProps {
  trigger: React.ComponentPropsWithoutRef<typeof Input>
  label?: LabelType
  badge?: React.ComponentPropsWithoutRef<typeof CommandShortcut>
  keys?: string[]
}

const DuckTableSearchInput = React.forwardRef<React.ElementRef<typeof Input>, DuckTableSearchInputProps>(
  ({ trigger, label, badge, keys }, ref) => {
    const { children: badgeChildren = '⌃+⇧+F', className: badgeClassName, ...badgeProps } = badge ?? {}
    const { children: labelChildren = 'Filter tasks...', className: labelClassName, ...labelProps } = label ?? {}
    const {
      className: triggerClassName = 'h-8 w-[150px] lg:w-[200px]',
      placeholder = 'Filter tasks...',
      ...triggerProps
    } = trigger ?? {}

    //NOTE: Duck shortcut
    const inputRef = React.useRef<HTMLInputElement>(null)
    useDuckShortcut(
      {
        keys: keys ?? ['ctrl+shift+f'],
        onKeysPressed: () => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        },
      },
      [inputRef]
    )

    console.log(triggerProps, 'asdfasdf')
    return (
      <div
        className="flex flex-col"
        ref={ref}
      >
        <Tooltip delayDuration={100}>
          <TooltipTrigger>
            <Input
              className={cn('h-8 w-[150px] lg:w-[200px]', triggerClassName)}
              ref={inputRef}
              placeholder={placeholder}
              {...triggerProps}
            />
          </TooltipTrigger>
          <TooltipContent
            className={cn('flex items-center gap-2 z-50 justify-start', labelClassName)}
            {...labelProps}
          >
            <CommandShortcut
              className="text-[.8rem]"
              {...badgeProps}
            >
              <Badge
                variant="secondary"
                size="sm"
                className="p-0 px-2"
              >
                {badgeChildren}
              </Badge>
            </CommandShortcut>
            <p className="text-sm">{labelChildren}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }
)

export interface DuckTableFilterProps<
  T extends Record<string, any> = Record<string, string>,
  Y extends keyof Record<string, unknown> = string,
> extends React.HTMLProps<HTMLDivElement> {
  filter: ComboboxType<Y, Extract<keyof T, string>>[]
}

export const DuckTableFilter = <
  T extends Record<string, any> = Record<string, string>,
  Y extends keyof Record<string, unknown> = string,
>({
  children,
  filter,
  className,
  ...props
}: DuckTableFilterProps<T, Y>) => {
  const { filterBy, setFilterBy } = useDuckTable() ?? {}

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {filter?.map((filter, idx) => {
        const { className: triggerClassName, children: triggerChildren, ...triggerProps } = filter?.trigger ?? {}
        return (
          <Combobox<Y, Extract<keyof T, string>>
            key={idx}
            type={'listbox'}
            title={filter?.title}
            wrapper={filter?.wrapper}
            trigger={{
              icon: {
                children: CirclePlus,
                className: '!size-4 stroke-[1.5]',
              },
              children: (triggerChildren ?? 'not found') as Y,
              className: cn('[&>div>span]:text-xs ml-auto w-[88px] lg:w-auto capitalize', triggerClassName),
              ...triggerProps,
            }}
            onSelect={
              filter?.onSelect ?? {
                value: filterBy as Extract<keyof T, string>[],
                setValue: setFilterBy as React.Dispatch<React.SetStateAction<Extract<keyof T, string>[]>>,
              }
            }
            content={{
              ...filter?.content!,
            }}
          />
        )
      })}
    </div>
  )
}

export interface DuckTableBarRightSideProps extends React.HTMLProps<HTMLDivElement> {}

export const DuckTableBarRightSide = React.forwardRef<HTMLDivElement, DuckTableBarRightSideProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('grid lg:flex items-center lg:justify-between gap-2', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

export interface DuckTableBarLeftSideProps extends React.HTMLProps<HTMLDivElement> {}

export const DuckTableBarLeftSide = React.forwardRef<HTMLDivElement, DuckTableBarLeftSideProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('grid lg:flex items-center lg:justify-between gap-2', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

export interface DuckTableBarActionsProps<T extends Record<string, unknown>, C extends boolean> {
  header: TableHeaderType<T, C>[]
}

export const TableBarViewButton = <T extends Record<string, any> = Record<string, string>, C extends boolean = false>({
  header,
}: DuckTableBarActionsProps<T, C>) => {
  const { setColumnsViewed, columnsViewed } = useDuckTable<T>() ?? {}

  const option_data = get_options_data<T>({ header, columnsViewed, setColumnsViewed })

  return (
    <>
      <DropdownMenuView
        trigger={{
          children: (
            <>
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              View
            </>
          ),
          className: 'ml-auto [&>div]:h-8 h-8 w-[79px] lg:flex [&>div]:gap-0 text-xs',
          label: {
            children: 'Toggle columns',
            showCommand: true,
            showLabel: true,
            side: 'top',
          },
          command: {
            key: 'ctrl+shift+v',
            label: '⌃+⇧+V',
          },
        }}
        content={{
          label: {
            children: 'Toggle columns',
          },
          options: {
            itemType: 'checkbox',
            optionsData: option_data,
          },
        }}
      />
    </>
  )
}

export interface DuckTableHeaderProps<
  T extends Record<string, any> = Record<string, string>,
  C extends boolean = true,
> {
  headers: TableHeaderType<T, C>[]
  selectable?: boolean
}

export const DuckTableHeader = <T extends Record<string, any> = Record<string, string>, C extends boolean = true>({
  headers,
  selectable,
}: DuckTableHeaderProps<T, C>) => {
  return (
    <>
      <TableHeader>
        <TableRow>
          {headers?.map((column, idx) => {
            // console.log(column)
            const { children, className, sortable, label, showLabel, dropdownMenuOptions, currentSort, ...props } =
              column
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
            const fullDropDownMenuOptions = dropdownMenuOptions?.map(item => {
              return {
                ...item,
                // onClick: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>) => {
                //   item.action?.(e, actionsArgs)
                // },
              }
            })

            return (
              headers.some(header => header.children === column.children) && (
                <React.Fragment key={idx}>
                  {idx === 0 && (
                    <TableHead
                      className={cn(
                        'flex items-center w-full data-[state=open]:bg-accent text-xs capitalize h-[50px] py-2',
                        dropdownMenuOptions?.length && 'justify-end'
                      )}
                      {...props}
                    >
                      {selectable && (
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
                      )}
                    </TableHead>
                  )}
                  <TableHead
                    className={cn('h-[40px] py-2', className)}
                    {...props}
                  >
                    {/*NOTE: Rendering Sorting else rendering label*/}
                    {!sortable ? (
                      <span>{(label as string) ?? children}</span>
                    ) : (
                      <div className={cn('flex items-center space-x-2', className)}>
                        {dropdownMenuOptions?.length && (
                          <DropdownMenuView<TableDropdownMenuOptionsType<T, C>>
                            trigger={{
                              className: '-ml-3 h-8 data-[state=open]:bg-accent text-xs ',
                              children: (
                                <>
                                  <span className="capitalize">{(label as string) ?? children}</span>
                                  {headers[idx]?.currentSort === 'asc' ? (
                                    <ArrowDownIcon className="ml-2 h-4 w-4" />
                                  ) : headers[idx]?.currentSort === 'desc' ? (
                                    <ArrowUpIcon className="ml-2 h-4 w-4" />
                                  ) : (
                                    <CaretSortIcon className="ml-2 h-4 w-4" />
                                  )}
                                </>
                              ),
                              label: showLabel
                                ? {
                                    children: label.toString() + ' options',
                                    className: 'capitalize',
                                    showLabel: true,
                                    side: 'top',
                                  }
                                : undefined,
                              variant: 'ghost',
                              size: 'sm',
                            }}
                            content={{
                              align: 'start',
                              options: {
                                group: [2, 1],
                                optionsData: fullDropDownMenuOptions as
                                  | DropdownMenuOptionsDataType<TableDropdownMenuOptionsType<T, C>>[]
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
            )
          })}
        </TableRow>
      </TableHeader>
    </>
  )
}
DuckTableHeader.displayName = 'TableCustomViewHeader'

const TableCustomBody = <
  T extends boolean,
  C extends Record<string, unknown>,
  Y extends keyof Record<string, unknown>,
>({
  headers,
  resultArrays,
  paginationState,
  selection,
  selected,
  setSelected,
  dropdownMenu,
  contextMenu,
  filtersData,
}: TableCustomBodyProps<T, C, Y>) => {
  return (
    <TableBody>
      {resultArrays[paginationState.activePage ?? 0]?.map((item, idx) => {
        const tableDataFiltered = Object.entries(item).filter(([key]) => {
          const headersEntries = headers.map(
            item => item.label.toString().toLowerCase() ?? item.children?.toString().toLowerCase()
          )
          return headersEntries.includes(key.toLowerCase())
        }) as TableDataFilteredType<typeof item>

        return (
          <ContextCustomView
            key={idx}
            trigger={{
              children,
            }}
            content={{
              options: contextMenu,
            }}
          />
        )
      })}
    </TableBody>
  )
}

export type TableBodyRowProps<T extends Record<string, unknown>> = DuckContextMenuProps<T> &
  React.HTMLProps<HTMLTableRowElement>

export const DuckTableBodyRow = <C extends Record<string, unknown>>({
  wrapper,
  trigger,
  content,
  children,
  ...props
}: TableBodyRowProps<C>) => {
  return (
    <ContextCustomView
      trigger={{
        ...trigger,
        children: (
          <TableRow
            {...props}
            className=""
          >
            {children ?? trigger?.children}
          </TableRow>
        ),
      }}
      wrapper={wrapper}
      content={content}
    />
  )
}

const TableCustomFooter = ({ className, columns }: TableFooterProps) => {
  return (
    <TableFooter className={cn(className)}>
      <TableRow>
        {columns?.map((item, idx) => {
          const { children, ...props } = item
          return (
            <TableCell
              key={idx}
              {...props}
            >
              {children}
            </TableCell>
          )
        })}
      </TableRow>
    </TableFooter>
  )
}

const TablePagination = <
  C extends Record<string, unknown> = Record<string, string>,
  Y extends keyof Record<string, unknown> = string,
>({
  resultArrays,
  selected,
  paginationState,
  paginations,
  value,
  tableData,
  setPaginationState,
  setValue,
}: TablePaginationType<C>) => {
  //NOTE: gen the page length data
  const pageLengthData = paginations?.groupSize
    ? Array.from({ length: Math.ceil(tableData.length / paginations.groupSize) }, (_, index) => {
        const start = index * paginations.groupSize + 1
        const end = Math.min((index + 1) * paginations.groupSize, tableData.length)
        if (start > tableData.length) return null
        return end.toString()
      })
        .filter(Boolean)
        .reduce((acc, curr) => {
          acc.push({ label: curr!, element: { children: curr! } })
          return acc
        }, [] as CommandListGroupDataType[])
    : []

  return (
    <>
      <div className="grid lg:flex items-center lg:justify-between gap-4 lg::gap-0">
        <div className="flex items-center justify-between">
          {/*NOTE: Select Count */}
          {paginations?.showSelectCount && (
            <span className="flex items-center justify-center text-sm font-medium text-muted-foreground whitespace-nowrap">
              {selected.length} of {tableData.length} row(s) selected.
            </span>
          )}
        </div>
        <div className="flex items-center lg:justify-between lg:gap-4">
          {/*NOTE: Group Size */}
          {paginations?.showGroup && (
            <div className="flex items-center gap-2">
              <span className="max-2xl:hidden flex items-center justify-center text-sm font-medium text-muted-foreground whitespace-nowrap">
                Rows per page
              </span>
              <TooltipProvider>
                <Combobox<Extract<keyof C, string>, Y>
                  type="combobox"
                  content={{
                    data: (pageLengthData ?? []) as CommandListGroupDataType<Y>[],
                    showSearchInput: false,
                    className: 'w-[5rem] h-fit',
                  }}
                  trigger={{
                    command: {
                      key: 'ctrl+shift+c',
                      label: '⌃+⇧+C',
                    },
                    label: {
                      children: 'Rows per page',
                      showLabel: true,
                      side: 'top',
                      className: 'text-xs',
                      showCommand: true,
                    },
                    className: 'w-[4.5rem] h-[32px] gap-0',
                  }}
                  onSelect={{
                    setValue: setValue as React.Dispatch<React.SetStateAction<Y[]>>,
                    value: value as Y[],
                  }}
                />
              </TooltipProvider>
            </div>
          )}
          {paginations?.showPageCount && (
            <span className="max-lg:hidden flex items-center justify-center text-sm font-medium text-muted-foreground whitespace-nowrap">
              Page {paginationState.activePage + 1} of {resultArrays.length}
            </span>
          )}

          {/*NOTE: Navigation */}
          {paginations?.showNavigation && (
            <PaginationCustomView
              right={{
                onClick: () =>
                  setPaginationState({
                    ...paginationState,
                    activePage:
                      paginationState.activePage === resultArrays.length - 1
                        ? resultArrays.length - 1
                        : (paginationState.activePage ?? 1) + 1,
                  }),
                command: {
                  key: 'ctrl+shift+up',
                  label: '⌃+⇧+↑',
                  action: () =>
                    setPaginationState({
                      ...paginationState,
                      activePage:
                        paginationState.activePage === resultArrays.length - 1
                          ? resultArrays.length - 1
                          : (paginationState.activePage ?? 1) + 1,
                    }),
                },
                label: {
                  showCommand: true,
                  showLabel: true,
                  side: 'top',
                  children: 'Next page',
                },
                disabled: paginationState.activePage === resultArrays.length - 1,
              }}
              maxRight={{
                onClick: () => setPaginationState({ ...paginationState, activePage: resultArrays.length - 1 }),
                command: {
                  key: 'ctrl+shift+right',
                  label: '⌃+⇧+→',
                  action: () => setPaginationState({ ...paginationState, activePage: resultArrays.length - 1 }),
                },
                label: {
                  showCommand: true,
                  showLabel: true,
                  side: 'top',
                  children: 'Last page',
                },
                disabled: paginationState.activePage === resultArrays.length - 1,
              }}
              left={{
                onClick: () =>
                  setPaginationState({
                    ...paginationState,
                    activePage: paginationState.activePage === 0 ? 0 : (paginationState.activePage ?? 1) - 1,
                  }),
                command: {
                  key: 'ctrl+shift+down',
                  label: '⌃+⇧+↓',
                  action: () =>
                    setPaginationState({
                      ...paginationState,
                      activePage: paginationState.activePage === 0 ? 0 : (paginationState.activePage ?? 1) - 1,
                    }),
                },
                label: {
                  showCommand: true,
                  showLabel: true,
                  side: 'top',
                  children: 'Previous page',
                },
                disabled: paginationState.activePage === 0,
              }}
              maxLeft={{
                onClick: () => setPaginationState({ ...paginationState, activePage: 0 }),
                command: {
                  key: 'ctrl+shift+left',
                  label: '⌃+⇧+←',
                  action: () => setPaginationState({ ...paginationState, activePage: 0 }),
                },
                label: {
                  showCommand: true,
                  showLabel: true,
                  side: 'top',
                  children: 'First page',
                },
                disabled: paginationState.activePage === 0,
              }}
            />
          )}
        </div>
      </div>
    </>
  )
}

TablePagination.displayName = 'TablePagination'

export interface DuckTableProps extends React.ComponentPropsWithoutRef<typeof Table> {
  wrapper?: React.ComponentPropsWithoutRef<typeof ScrollArea>
}

export const DuckTable = ({ wrapper, className, children, ...props }: DuckTableProps) => {
  const { className: wrapperClassName, ...wrapperProps } = wrapper! ?? {}

  return (
    <ScrollArea
      className={cn('border border-border rounded-lg !overflow-visible', wrapperClassName)}
      {...wrapperProps}
    >
      <Table {...props}>{children}</Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

DuckTable.displayName = 'DuckTable'

// const {children: captionChildren, className: captionClassName, ...captionProps } = caption! ?? []
// const [selected, setSelected] = React.useState<TableContentDataType<C>[]>([])
// const [tableData, setTableData] = React.useState<TableContentDataType<C>[]>(tableContentData)
// const [paginationState, setPaginationState] = React.useState({
//     activePage: pagination?.activePage ?? 0,
//     groupSize: pagination?.groupSize ?? tableData.length,
// })
// const [headers, setHeaders] = React.useState<TableHeaderType<T, C>[]>(header ?? [])
// const [search, setSearch] = React.useState<{ q: string; qBy: string[] }>({q: '', qBy: [] })
// const [value, setValue] = React.useState<string[]>([paginationState.groupSize.toString()])
//
// const [filterLabels, setFilterLabels] = React.useState<{ [key: string]: number }>({})
//
// //NOTE: Function to split array into chunks
// const splitIntoChunks = (array: typeof tableData, chunkSize: number) => {
//     const chunks = []
//     for (let i = 0; i < array.length; i += chunkSize) {
//         chunks.push(array.slice(i, i + chunkSize))
//     }
//     return chunks
// }
//
// const filteredData = React.useMemo(() => {
//     //NOTE: Step 1: Filter the data based on search.q and search.qBy
//     const data = tableData.filter(item => {
//         return !search.qBy.length
//             ? Object.values(item).some(value => JSON.stringify(value).toLowerCase().includes(search.q.toLowerCase()))
//             : Object.values(item).some(value =>
//                 search.qBy.some(q => JSON.stringify(value).toLowerCase().includes(q.toLowerCase()))
//             )
//     })
//
//     //NOTE: Step 2: Calculate label counts based on the filtered data
//     const labelCounts: {[key: string]: number } = {}
//     data.forEach(item => {
//         Object.values(item).forEach(value => {
//             filters?.forEach(filter => {
//                 filter?.content?.data.forEach(option => {
//                     const label = option?.label?.toString().toLowerCase()
//                     if (
//                         JSON.stringify(value)
//                             .toLowerCase()
//                             .includes(label ?? '')
//                     ) {
//                         labelCounts[label ?? ''] = (labelCounts[label ?? ''] || 0) + 1
//                     }
//                 })
//             })
//         })
//     })
//
//     setFilterLabels(labelCounts)
//
//     return data
// }, [tableData, filters, search])
//
// //NOTE: Step 3: Update the filters to display the count based on the filtered data
// const updatedFilters = React.useMemo(() => {
//     return filters?.map(filter => {
//         return {
//             ...filter,
//             content: {
//                 ...filter.content,
//                 data: filter?.content?.data.map(option => {
//                     const label = option?.label?.toString().toLowerCase()
//                     return {
//                         ...option,
//                         element: {
//                             ...option.element,
//                             label: {
//                                 ...option?.element?.label,
//                                 children: filterLabels[label ?? ''] || 0,
//                             },
//                         },
//                     }
//                 }),
//             },
//         }
//     })
// }, [filters, filterLabels])
//
// //NOTE: Step 4: Split the data into chunks based on the groupSize
// const resultArrays = splitIntoChunks(filteredData, +value)

// {tableData && !!resultArrays.length && (
//     <TableCustomBody<T, C, Y>
//         headers={headers}
//         resultArrays={resultArrays}
//         paginationState={paginationState}
//         selection={selection ?? false}
//         selected={selected}
//         filtersData={filters}
//         setSelected={setSelected}
//         dropdownMenu={dropdownMenu ?? {}}
//         contextMenu={contextMenu ?? {}}
//     />
// )}
// {footer?.columns && <TableCustomFooter {...footer} />}
// {caption && (
//     <div
//         className={cn('mb-4 text-sm text-muted-foreground text-center', captionClassName)}
//         {...captionProps}
//     >
//             {caption?.children}
//         </div>
// )}
// {pagination && (
//     <TablePagination<C>
//         selected={selected}
//         value={value}
//         tableData={tableData}
//         resultArrays={resultArrays}
//         paginationState={paginationState}
//         paginations={pagination}
//         setValue={setValue}
//         setPaginationState={setPaginationState}
//     />
// )}
DuckTable.displayName = 'TableCustomView'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  DuckTable as TableCustomView,
}
