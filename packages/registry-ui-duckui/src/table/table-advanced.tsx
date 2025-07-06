import { cn } from '@gentleduck/libs/cn'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../button'
import { Label } from '../label'
import { Pagination, PaginationContent, PaginationItem } from '../pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../select'
import { createDuckTable, useAtom } from './table.atom'
import { DuckTableType } from './table.types'

export function DuckTable({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} duck-table="">
      {children}
    </div>
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
  actions,
  atoms,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  actions: ReturnType<typeof createDuckTable<TRow>>['actions']
  atoms: ReturnType<typeof createDuckTable<TRow>>['atoms']
}) {
  const pageSize = useAtom(atoms.pageSize)

  const options = [5, 10, 20, 50, 100]

  return (
    <div duck-table-row-per-page="" className={cn('flex items-center gap-2', className)} {...props}>
      <Label className="text-nowrap text-sm">Rows per page</Label>
      <Select
        // value={String(pageSize)}
        // onValueChange={(value) => {
        //   // actions.setPageSize(Number(value))
        // }}

        id="select">
        <SelectTrigger className="px-2 w-[60px] h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-[60px] py-2">
          <SelectGroup>
            {options.map((item) => (
              <SelectItem key={item} value={String(item)} onClick={() => actions.setPageSize(item)}>
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
  table,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  table: DuckTableType<TRow>
}) {
  return (
    <div duck-table-selected-rows="" className={cn('flex items-center gap-2', className)} {...props}>
      <Label className="text-nowrap">
        {table.getSelectedRows().length} of {table.getRawData().length} row(s) selected
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
  const page = useAtom(atoms.page)
  const totalPages = useAtom(atoms.totalPages)

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
