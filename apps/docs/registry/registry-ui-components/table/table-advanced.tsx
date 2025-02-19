import React from 'react'
import { cn } from '@/lib'
import {
  DuckTableContextType,
  DuckTableProps,
  DuckTableProviderProps,
  TableColumnType,
  TableSearchStateType,
  TableSortByStateType,
} from './table-advanced.types'
import { Table } from './table'
import { ScrollArea, ScrollBar } from '@/registry/default/ui/scroll-area'
import {
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/default/ui/ShadcnUI/table'
import { Checkbox } from '@/registry/default/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuOptionsDataType,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuView,
} from '@/registry/default/ui/dropdown-menu'
import { ArrowDownIcon, ArrowUpIcon, LucideIcon } from 'lucide-react'
import { CaretSortIcon, EyeNoneIcon } from '@radix-ui/react-icons'
import { Button } from '../button'
import { dropdownMenuOptions } from './table-advanced.constants'

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

  const [sortBy, setSortBy] = React.useState<
    Map<string, TableSortByStateType<TColumnName>>
  >(new Map())

  console.log(sortBy)

  return (
    <DuckTableContext.Provider
      value={{
        table_columns,
        table_rows,
        search,
        setSearch,
        setSortBy,
        sortBy,
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

export interface DuckTableHeaderProps { }

export function DuckTableHeader({ }: DuckTableHeaderProps) {
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

            return (
              <React.Fragment key={idx}>
                {idx === 0 && (
                  <DuckTableCheckbox
                    type="header"
                    className={cn(sortable && 'justify-end')}
                  />
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
                    <DuckTableHeadSelectable
                      column={column}
                      label={(label as string) ?? children}
                      showLabel={showLabel}
                    />
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

export interface DuckTableCheckboxProps
  extends React.ComponentPropsWithoutRef<typeof TableHead> {
  selectable?: boolean | undefined
  type: 'header' | 'body'
}

export function DuckTableCheckbox({
  className,
  selectable,
  type,
  ...props
}: DuckTableCheckboxProps) {
  const Component =
    //TODO: type to fix this type hence i want it to be compatible with both Row and Head.
    (type === 'header' ? TableHead : TableRow) as typeof TableHead

  return (
    <Component
      className={cn(
        'flex items-center w-full data-[state=open]:bg-accent text-xs capitalize h-[51px] py-2',
        className,
      )}
      {...props}
    >
      {selectable && (
        <Checkbox
          className="border-border"
        // onClick={() => {
        //   setSelected(selected.length === tableData.length ? [] : tableData.map(item => item)
        // }}
        // checked={
        // selected.length === tableData.length
        //   ? true
        //   : selected.length < tableData.length && selected.length
        //     ? 'indeterminate'
        //     : false
        // }
        />
      )}
    </Component>
  )
}

export interface DuckTableHeadSelectableProps<TSort extends boolean = true>
  extends React.HTMLProps<HTMLDivElement> {
  column: TableColumnType<TSort>
  label: string
  showLabel?: boolean | undefined
}

export function DuckTableHeadSelectable<TSort extends boolean = true>({
  column,
  label,
  showLabel,
  children,
}: DuckTableHeadSelectableProps<TSort>) {
  const { sortBy, setSortBy } = useDuckTable()

  return (
    <div className={cn('flex items-center space-x-2')}>
      {(dropdownMenuOptions?.length ?? 0) > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="data-[state=open]:bg-accent [&>div]:justify-between w-full [&>div]:w-full capitalize"
              secondIcon={{
                className: '-ml-3',
                children: (column?.currentSort === 'asc'
                  ? ArrowDownIcon
                  : column?.currentSort === 'desc'
                    ? ArrowUpIcon
                    : CaretSortIcon) as LucideIcon,
              }}
              label={
                showLabel
                  ? {
                    children: label.toString() + ' options',
                    className: 'capitalize',
                    showLabel: true,
                    side: 'top',
                  }
                  : undefined
              }
            >
              {(label as string) ?? children}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuGroup>
              {dropdownMenuOptions.map((item, idx) => {
                return (
                  <>
                    {idx === dropdownMenuOptions.length - 1 && (
                      <DropdownMenuSeparator />
                    )}
                    <DropdownMenuItem
                      className="p-0 capitalize"
                      key={idx}
                      onClick={() => {
                        setSortBy((prev) => {
                          const new_set = new Map(prev)
                          new_set.set(label, {
                            label,
                            type: item.children,
                          })
                          return new_set
                        })
                      }}
                    >
                      <Button {...item} />
                    </DropdownMenuItem>
                  </>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
