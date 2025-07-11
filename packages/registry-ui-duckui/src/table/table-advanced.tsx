import { cn } from '@gentleduck/libs/cn'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../button'
import { Label } from '../label'
import { Pagination, PaginationContent, PaginationItem } from '../pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../select'
import { createDuckTable, useAtom, useAtomValue } from './table.atom'

export type DuckTableContextType<T extends Record<string, unknown>> = {
  table: ReturnType<typeof createDuckTable<T>>
}

export const DuckTableContext = React.createContext<DuckTableContextType<any> | null>(null)

export function useDuckTable<T extends Record<string, unknown>>() {
  const context = React.useContext(DuckTableContext)
  if (!context) {
    throw new Error('useTableProvider must be used within an TableProvider')
  }
  return context as DuckTableContextType<T>
}

export function DuckTable<T extends Record<string, unknown>>({
  children,
  table,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  table: ReturnType<typeof createDuckTable<T>>
}) {
  return (
    <DuckTableContext.Provider value={{ table: table as any }}>
      <div {...props} duck-table="">
        {children}
      </div>
    </DuckTableContext.Provider>
  )
}

export function DuckTableBody({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} duck-table-body="">
      {children}
    </div>
  )
}

export function DuckTableRowPerPage<TRow extends Record<string, unknown>>({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { table } = useDuckTable<TRow>()
  const pageSize = useAtomValue(table.atoms.pageSize)

  const options = [5, 10, 20, 50, 100]

  return (
    <div duck-table-row-per-page="" className={cn('flex items-center gap-2', className)} {...props}>
      <Label className="text-nowrap text-sm">Rows per page</Label>
      <Select
        value={String(pageSize)}
        onValueChange={(value) => {
          table.actions.setPageSize(Number(value))
        }}
        id="select">
        <SelectTrigger className="px-2 w-[70px] h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-[65px] py-2">
          <SelectGroup>
            {options.map((item) => (
              <SelectItem key={item} value={String(item)}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export function DuckTableSelectedRows<TRow extends Record<string, unknown>>({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { table } = useDuckTable<TRow>()

  const selectedCount = useAtom(table.atoms.selected)
  const totalCount = useAtom(table.atoms.rows)

  return (
    <div duck-table-selected-rows="" className={cn('flex items-center gap-2', className)} {...props}>
      <Label className="text-nowrap">
        {selectedCount.length} of {totalCount.length} row(s) selected
      </Label>
    </div>
  )
}

export function DuckTablePagination<TRow extends Record<string, unknown>>({
  actions,
  atoms,
}: {
  actions: ReturnType<typeof createDuckTable<TRow>>['actions']
  atoms: ReturnType<typeof createDuckTable<TRow>>['atoms']
}) {
  const page = useAtomValue(atoms.page)
  const totalPages = useAtomValue(atoms.totalPages)

  const isFirst = page <= 1
  const isLast = page >= totalPages

  return (
    <Pagination className={cn('justify-end')}>
      <PaginationContent className={cn('gap-2')}>
        <PaginationItem>
          <Button variant="outline" size="icon" className="p-0" onClick={actions.firstPage} disabled={isFirst}>
            <ChevronsLeftIcon className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button variant="outline" size="icon" className="p-0" onClick={actions.prevPage} disabled={isFirst}>
            <ChevronLeftIcon className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <span className="text-sm px-2 py-1 text-muted-foreground">
            Page {page} of {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <Button variant="outline" size="icon" className="p-0" onClick={actions.nextPage} disabled={isLast}>
            <ChevronRightIcon className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button variant="outline" size="icon" className="p-0" onClick={actions.lastPage} disabled={isLast}>
            <ChevronsRightIcon className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
