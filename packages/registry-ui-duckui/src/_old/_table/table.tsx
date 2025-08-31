// @ts-noCheck
import * as React from 'react'

import { ScrollArea } from '../scroll-area'
import { PaginationCustomView } from '../pagination'
import { Input } from '../input'
import { Combobox, type ComboboxType } from '../combobox'
import { CommandShortcut, type CommandListGroupDataType } from '../command'
import { DropdownMenuView } from '../dropdown-menu'
import { ContextCustomView, DuckContextMenuProps } from '../context-menu'

import {
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip'
import { LabelType } from '../button'
import { Badge } from '../badge'
import { useDebounceCallback } from '@gentleduck/hooks/use-debounce'
import { get_options_data } from './table.lib'
import { PAGE_INDEX, PAGE_SIZE } from './table.constants'
import { useDuckTable } from './table.hook'
import { TableHeaderType, TablePaginationType } from './table.types'

import { cn } from '@gentleduck/libs/cn'
import { groupArrays } from '@gentleduck/libs/group-array'

import { CirclePlus, LucideIcon } from 'lucide-react'
import { CaretSortIcon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Separator } from '../separator'

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
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
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
    ref={ref}
    className={cn('[&_tr]:border-b', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
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
            ref={inputRef}
            placeholder={placeholder}
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
              variant='secondary'
              size='sm'
              className='p-0 px-2'
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
            key={idx}
            type={'listbox'}
            title={filter?.title}
            wrapper={filter?.wrapper}
            trigger={{
              icon: { children: CirclePlus },
              children: (triggerChildren ?? 'not found') as Y,
              size: 'sm',
              className: cn('', triggerClassName),
              ...triggerProps,
            }}
            onSelect={
              filter?.onSelect ?? {
                value: filterBy as Extract<keyof T, string>[],
                setValue: setFilterBy as React.Dispatch<
                  React.SetStateAction<Extract<keyof T, string>[]>
                >,
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
    header,
    columnsViewed,
    setColumnsViewed,
  })

  return (
    <>
      <DropdownMenuView
        trigger={{
          size: 'sm',
          icon: {
            children: MixerHorizontalIcon as LucideIcon,
          },
          children: 'View',
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
      trigger={{
        ...trigger,
        children: (
          <TableRow {...props}>{children ?? trigger?.children}</TableRow>
        ),
      }}
      wrapper={wrapper}
      content={content}
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
      right={{
        onClick: () => {
          setPagination((old) => ({
            ...old,
            pageIndex:
              old.pageIndex === old.pageSize - 1
                ? old.pageSize - 1
                : (old.pageIndex ?? 1) + 1,
          }))
        },
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
          showCommand: true,
          showLabel: true,
          side: 'top',
          children: 'Next page',
        },
        // disabled: paginationState.activePage === resultArrays.length - 1,
      }}
      maxRight={{
        // onClick: () => setPaginationState({ ...paginationState, activePage: resultArrays.length - 1 }),
        // command: {
        //     key: 'ctrl+shift+right',
        //     label: '⌃+⇧+→',
        //     action: () => setPaginationState({ ...paginationState, activePage: resultArrays.length - 1 }),
        // },
        label: {
          showCommand: true,
          showLabel: true,
          side: 'top',
          children: 'Last page',
        },
        // disabled: paginationState.activePage === resultArrays.length - 1,
      }}
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
          showCommand: true,
          showLabel: true,
          side: 'top',
          children: 'Previous page',
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
          showCommand: true,
          showLabel: true,
          side: 'top',
          children: 'First page',
        },
        // disabled: paginationState.activePage === 0,
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
        acc.push({ label: curr!, element: { children: curr! } })
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
                  type='combobox'
                  content={{
                    data: (pageLengthData ??
                      []) as CommandListGroupDataType<Y>[],
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
                    setValue: setValue as React.Dispatch<
                      React.SetStateAction<Y[]>
                    >,
                    value: value as Y[],
                  }}
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
