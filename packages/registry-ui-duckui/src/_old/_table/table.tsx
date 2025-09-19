// @ts-noCheck


import { cn } from '@gentleduck/libs/cn'
import { groupArrays } from '@gentleduck/libs/group-array'
import { useDebounceCallback } from '@gentleduck/libs/use-debounce'
import { CaretSortIcon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { CirclePlus, LucideIcon } from 'lucide-react'
import * as React from 'react'
import { Badge } from '../badge'
import { LabelType } from '../button'
import { Combobox, type ComboboxType } from '../combobox'
import { type CommandListGroupDataType, CommandShortcut } from '../command'
import { ContextCustomView, DuckContextMenuProps } from '../context-menu'
import { DropdownMenuView } from '../dropdown-menu'
import { Input } from '../input'
import { PaginationCustomView } from '../pagination'
import { ScrollArea } from '../scroll-area'
import { Separator } from '../separator'
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipTrigger,
} from '../tooltip'
import { PAGE_INDEX, PAGE_SIZE } from './table.constants'
import { useDuckTable } from './table.hook'
import { get_options_data } from './table.lib'
import { TableHeaderType, TablePaginationType } from './table.types'

/*
 *  - This's the normal table components.
 *  It's a custom table component, you can use the dataTable Functionality down
 *  this file to make sure you get the best performance, out of this table with
 *  a more customized design.
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className='relative w-full overflow-auto'>
    <table
      className={cn('w-full caption-bottom text-sm', className)}
      ref={ref}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    className={cn('[&_tr]:border-b', className)}
    ref={ref}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    className={cn('[&_tr:last-child]:border-0', className)}
    ref={ref}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    ref={ref}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className
    )}
    ref={ref}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className
    )}
    ref={ref}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    ref={ref}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    ref={ref}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export const DuckTableBar = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'flex items-end lg:items-center justify-between gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface DuckTableSearchProps extends React.HTMLProps<HTMLDivElement> {
  input?: DuckTableSearchInputProps
}

export const DuckTableSearch = ({
  children,
  className,
  input,
  ...props
}: DuckTableSearchProps) => {
  const { setSearch } = useDuckTable() ?? {}

  //NOTE: Debounce search
  const debouncedSearch = useDebounceCallback(
    (newValue: string) => setSearch?.((_) => ({ query: newValue })),
    500
  )

  return (
    <div
      className={cn('flex flex-1 items-center space-x-2', className)}
      {...props}
    >
      <DuckTableSearchInput
        {...input}
        trigger={{
          ...input?.trigger,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
            debouncedSearch(event.target.value),
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

const DuckTableSearchInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  DuckTableSearchInputProps
>(({ trigger, label, badge, keys }, ref) => {
  const {
    children: badgeChildren = '⌃+⇧+F',
    className: badgeClassName,
    ...badgeProps
  } = badge ?? {}
  const {
    children: labelChildren = 'Filter tasks...',
    className: labelClassName,
    ...labelProps
  } = label ?? {}
  const {
    className: triggerClassName = 'h-8 w-[150px] lg:w-[200px]',
    placeholder = 'Filter tasks...',
    ...triggerProps
  } = trigger ?? {}

  //NOTE: Duck shortcut
  const inputRef = React.useRef<HTMLInputElement>(null)
  // useDuckShortcut(
  //   {
  //     keys: keys ?? ['ctrl+shift+f'],
  //     onKeysPressed: () => {
  //       if (inputRef.current) {
  //         inputRef.current.focus()
  //       }
  //     },
  //   },
  //   [inputRef],
  // )
  //

  return (
    <div
      className='flex flex-col'
      ref={ref}
    >
      <TooltipTrigger delayDuration={100}>
        <TooltipTrigger>
          <Input
            className={cn('h-8 w-[150px] lg:w-[200px]', triggerClassName)}
            placeholder={placeholder}
            ref={inputRef}
            {...triggerProps}
          />
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            'flex items-center gap-2 z-50 justify-start',
            labelClassName
          )}
          {...labelProps}
        >
          <CommandShortcut
            className='text-[.8rem]'
            {...badgeProps}
          >
            <Badge
              className='p-0 px-2'
              size='sm'
              variant='secondary'
            >
              {badgeChildren}
            </Badge>
          </CommandShortcut>
          <p className='text-sm'>{labelChildren}</p>
        </TooltipContent>
      </TooltipTrigger>
    </div>
  )
})

export interface DuckTableFilterProps<
  T extends Record<string, any> = Record<string, string>,
  Y extends keyof Record<string, unknown> = string
> extends React.HTMLProps<HTMLDivElement> {
  filter: ComboboxType<Y, Extract<keyof T, string>>[]
}

export const DuckTableFilter = <
  T extends Record<string, any> = Record<string, string>,
  Y extends keyof Record<string, unknown> = string
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
        const {
          className: triggerClassName,
          children: triggerChildren,
          ...triggerProps
        } = filter?.trigger ?? {}
        return (
          <Combobox<Y, Extract<keyof T, string>>
            content={{
              ...filter?.content!,
            }}
            key={idx}
            onSelect={
              filter?.onSelect ?? {
                setValue: setFilterBy as React.Dispatch<
                  React.SetStateAction<Extract<keyof T, string>[]>
                >,
                value: filterBy as Extract<keyof T, string>[],
              }
            }
            title={filter?.title}
            trigger={{
              children: (triggerChildren ?? 'not found') as Y,
              className: cn('', triggerClassName),
              icon: { children: CirclePlus },
              size: 'sm',
              ...triggerProps,
            }}
            type={'listbox'}
            wrapper={filter?.wrapper}
          />
        )
      })}
    </div>
  )
}

export interface DuckTableBarRightSideProps
  extends React.HTMLProps<HTMLDivElement> { }

export const DuckTableBarRightSide = React.forwardRef<
  HTMLDivElement,
  DuckTableBarRightSideProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        'grid lg:flex items-center lg:justify-between gap-2',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

export interface DuckTableBarLeftSideProps
  extends React.HTMLProps<HTMLDivElement> { }

export const DuckTableBarLeftSide = React.forwardRef<
  HTMLDivElement,
  DuckTableBarLeftSideProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        'grid lg:flex items-center lg:justify-between gap-2',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

export interface DuckTableBarActionsProps<
  T extends Record<string, unknown>,
  C extends boolean
> {
  header: TableHeaderType<T, C>[]
}

export const TableBarViewButton = <
  T extends Record<string, any> = Record<string, string>,
  C extends boolean = false
>({
  header,
}: DuckTableBarActionsProps<T, C>) => {
  const { setColumnsViewed, columnsViewed } = useDuckTable<T>() ?? {}

  const option_data = get_options_data<T>({
    columnsViewed,
    header,
    setColumnsViewed,
  })

  return (
    <>
      <DropdownMenuView
        content={{
          label: {
            children: 'Toggle columns',
          },
          options: {
            itemType: 'checkbox',
            optionsData: option_data,
          },
        }}
        trigger={{
          children: 'View',
          command: {
            key: 'ctrl+shift+v',
            label: '⌃+⇧+V',
          },
          icon: {
            children: MixerHorizontalIcon as LucideIcon,
          },
          label: {
            children: 'Toggle columns',
            showCommand: true,
            showLabel: true,
            side: 'top',
          },
          size: 'sm',
        }}
      />
    </>
  )
}

export type TableBodyRowProps<T extends Record<string, unknown>> = {
  row?: React.ComponentPropsWithoutRef<typeof TableRow>
} & Partial<DuckContextMenuProps<T>>

export const DuckTableBodyRow = <C extends Record<string, unknown>>({
  wrapper,
  trigger,
  content,
  row,
}: TableBodyRowProps<C>) => {
  const { children, ...props } = row ?? {}
  return (
    <ContextCustomView
      content={content}
      trigger={{
        ...trigger,
        children: (
          <TableRow {...props}>{children ?? trigger?.children}</TableRow>
        ),
      }}
      wrapper={wrapper}
    />
  )
}

export interface DuckTableFooterProps
  extends Partial<React.ComponentPropsWithoutRef<typeof TableFooter>> {
  columns: FooterColumnType[]
}
export type FooterColumnType = Partial<
  React.ComponentPropsWithoutRef<typeof TableCell>
>

export const DuckTableFooter = ({
  className,
  columns,
}: DuckTableFooterProps) => {
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

export interface DuckTableDownBarProps
  extends React.HTMLProps<HTMLDivElement> { }

export const DuckTableDownBar = ({
  children,
  className,
  ...props
}: DuckTableDownBarProps) => {
  return (
    <>
      <Separator />
      <div
        className={cn(
          'grid lg:flex items-center lg:justify-between gap-4 lg::gap-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  )
}
export type DuckTablePaginationProps = {}

export const DuckTablePagination = ({ }: DuckTablePaginationProps) => {
  const { pagination, setPagination } = useDuckTable() ?? {}
  return (
    /*NOTE: Navigation */
    <PaginationCustomView
      left={{
        // onClick: () =>
        //     setPaginationState({
        //         ...paginationState,
        //         activePage: paginationState.activePage === 0 ? 0 : (paginationState.activePage ?? 1) - 1,
        //     }),
        // command: {
        //     key: 'ctrl+shift+down',
        //     label: '⌃+⇧+↓',
        //     action: () =>
        //         setPaginationState({
        //             ...paginationState,
        //             activePage: paginationState.activePage === 0 ? 0 : (paginationState.activePage ?? 1) - 1,
        //         }),
        // },
        label: {
          children: 'Previous page',
          showCommand: true,
          showLabel: true,
          side: 'top',
        },
        // disabled: paginationState.activePage === 0,
      }}
      maxLeft={{
        // onClick: () => setPaginationState({ ...paginationState, activePage: 0 }),
        // command: {
        //     key: 'ctrl+shift+left',
        //     label: '⌃+⇧+←',
        //     action: () => setPaginationState({ ...paginationState, activePage: 0 }),
        // },
        label: {
          children: 'First page',
          showCommand: true,
          showLabel: true,
          side: 'top',
        },
        // disabled: paginationState.activePage === 0,
      }}
      maxRight={{
        // onClick: () => setPaginationState({ ...paginationState, activePage: resultArrays.length - 1 }),
        // command: {
        //     key: 'ctrl+shift+right',
        //     label: '⌃+⇧+→',
        //     action: () => setPaginationState({ ...paginationState, activePage: resultArrays.length - 1 }),
        // },
        label: {
          children: 'Last page',
          showCommand: true,
          showLabel: true,
          side: 'top',
        },
        // disabled: paginationState.activePage === resultArrays.length - 1,
      }}
      right={{
        command: {
          key: 'ctrl+shift+up',
          label: '⌃+⇧+↑',
          // action: () =>
          //     setPaginationState({
          //         ...paginationState,
          //         activePage:
          //             paginationState.activePage === resultArrays.length - 1
          //                 ? resultArrays.length - 1
          //                 : (paginationState.activePage ?? 1) + 1,
          //     })
          //     ,
        },
        label: {
          children: 'Next page',
          showCommand: true,
          showLabel: true,
          side: 'top',
        },
        onClick: () => {
          setPagination((old) => ({
            ...old,
            pageIndex:
              old.pageIndex === old.pageSize - 1
                ? old.pageSize - 1
                : (old.pageIndex ?? 1) + 1,
          }))
        },
        // disabled: paginationState.activePage === resultArrays.length - 1,
      }}
    />
  )
}

const TablePagination = <
  C extends Record<string, unknown> = Record<string, string>,
  Y extends keyof Record<string, unknown> = string
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
    ? Array.from(
      { length: Math.ceil(tableData.length / paginations.groupSize) },
      (_, index) => {
        const start = index * paginations.groupSize + 1
        const end = Math.min(
          (index + 1) * paginations.groupSize,
          tableData.length
        )
        if (start > tableData.length) return null
        return end.toString()
      }
    )
      .filter(Boolean)
      .reduce((acc, curr) => {
        acc.push({ element: { children: curr! }, label: curr! })
        return acc
      }, [] as CommandListGroupDataType[])
    : []

  return (
    <>
      <div className='grid lg:flex items-center lg:justify-between gap-4 lg::gap-0'>
        <div className='flex items-center justify-between'>
          {/*NOTE: Select Count */}
          {paginations?.showSelectCount && (
            <span className='flex items-center justify-center text-sm font-medium text-muted-foreground whitespace-nowrap'>
              {selected.length} of {tableData.length} row(s) selected.
            </span>
          )}
        </div>
        <div className='flex items-center lg:justify-between lg:gap-4'>
          {/*NOTE: Group Size */}
          {paginations?.showGroup && (
            <div className='flex items-center gap-2'>
              <span className='max-2xl:hidden flex items-center justify-center text-sm font-medium text-muted-foreground whitespace-nowrap'>
                Rows per page
              </span>
              <TooltipProvider>
                <Combobox<Extract<keyof C, string>, Y>
                  content={{
                    className: 'w-[5rem] h-fit',
                    data: (pageLengthData ??
                      []) as CommandListGroupDataType<Y>[],
                    showSearchInput: false,
                  }}
                  onSelect={{
                    setValue: setValue as React.Dispatch<
                      React.SetStateAction<Y[]>
                    >,
                    value: value as Y[],
                  }}
                  trigger={{
                    className: 'w-[4.5rem] h-[32px] gap-0',
                    command: {
                      key: 'ctrl+shift+c',
                      label: '⌃+⇧+C',
                    },
                    label: {
                      children: 'Rows per page',
                      className: 'text-xs',
                      showCommand: true,
                      showLabel: true,
                      side: 'top',
                    },
                  }}
                  type='combobox'
                />
              </TooltipProvider>
            </div>
          )}
          {paginations?.showPageCount && (
            <span className='max-lg:hidden flex items-center justify-center text-sm font-medium text-muted-foreground whitespace-nowrap'>
              Page {paginationState.activePage + 1} of {resultArrays.length}
            </span>
          )}
        </div>
      </div>
    </>
  )
}

TablePagination.displayName = 'TablePagination'

export type DuckTableBodyProps<T> = {
  data: T
  children: (data: T) => React.ReactNode
}

//NOTE: Function to split array into chunks
const splitIntoChunks = <T,>(array: T[], chunkSize: number) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

export const DuckTableBody = <T,>({
  data,
  children,
}: DuckTableBodyProps<T[]>) => {
  const { pagination, search, filterBy } = useDuckTable() ?? {}
  const tableDataGrouped = groupArrays<T>(
    [pagination?.pageSize ?? PAGE_SIZE],
    data
  )
  const pageIdx = pagination?.pageIndex ?? PAGE_INDEX

  // NOTE: Filter the items using the search query and filter keys.
  const filteredData = React.useMemo(() => {
    if (!tableDataGrouped[pageIdx]?.length) return []

    return tableDataGrouped[pageIdx]?.filter((item) => {
      const itemValues = Object.values(item as Record<string, unknown>).map(
        (value) => JSON.stringify(value).toLowerCase()
      )

      const matchesSearch = search?.query
        ? itemValues.some((value) => value.includes(search.query.toLowerCase()))
        : false

      const matchesFilterBy = filterBy?.length
        ? itemValues.some((value) =>
          filterBy.some((q) => value.includes(q.toLowerCase()))
        )
        : false

      return (
        (!search?.query && !filterBy?.length) ||
        matchesSearch ||
        matchesFilterBy
      )
    })
  }, [search, filterBy, tableDataGrouped, pageIdx])

  // NOTE: Split the data into chunks based on the group size.
  const resultArrays = React.useMemo(
    () => splitIntoChunks(filteredData, pagination?.pageSize ?? PAGE_SIZE),
    [filteredData, pagination?.pageSize]
  )

  console.log(filteredData)

  return (
    (resultArrays[pageIdx]?.length ?? 0 > 0) && (
      <TableBody>{children(resultArrays[pageIdx] as T[])}</TableBody>
    )
  )
}

export const EmptyTable = () => {
  return (
    <div className='w-full h-full flex items-center justify-center absolute top-1/2 left-1/2'>
      <h6 className='text-muted-foreground text-center'> No data </h6>
    </div>
  )
}

export interface DuckTableProps
  extends React.ComponentPropsWithoutRef<typeof Table> {
  wrapper?: React.ComponentPropsWithoutRef<typeof ScrollArea>
}

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

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
