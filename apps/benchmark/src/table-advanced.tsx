import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import React from 'react'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Pagination, PaginationContent, PaginationItem } from '@gentleduck/registry-ui-duckui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gentleduck/registry-ui-duckui/select'
import { createDuckTable } from './table.hooks'
import { useAtom, useAtomValue } from '@gentleduck/state/primitive'
import { cn } from './lib/utils'
import { duck_table } from './main'

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

export function DuckTable({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & {}) {
  return (
    <div {...props} duck-table="">
      {children}
    </div>
    //   <DuckTableContext.Provider value={{ table: table as any }}>
    // </DuckTableContext.Provider>
  )
}

export function DuckTableBody({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} duck-table-body="">
      {children}
    </div>
  )
}

export function DuckTableRowPerPage({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [pageSize, setPageSize] = useAtom(duck_table.atoms.pageSize)

  const options = [5, 10, 20, 50, 100]

  return (
    <div duck-table-row-per-page="" className={cn('flex items-center gap-2', className)} {...props}>
      <Label className="text-nowrap text-sm">Rows per page</Label>
      <Select
        value={String(pageSize)}
        onValueChange={(value) => {
          setPageSize(Number(value))
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

export function DuckTableSelectedRows({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const selectedCount = useAtomValue(duck_table.atoms.selectedRows)
  const totalCount = useAtomValue(duck_table.atoms.rows)

  return (
    <div duck-table-selected-rows="" className={cn('flex items-center gap-2', className)} {...props}>
      <Label className="text-nowrap">
        {selectedCount.length} of {totalCount.length} row(s) selected
      </Label>
    </div>
  )
}

export function DuckTablePagination({}: {}) {
  const [page, setPage] = useAtom(duck_table.atoms.currentPage)
  const totalPages = useAtomValue(duck_table.atoms.totalPages)

  const isFirst = page <= 1
  const isLast = page >= totalPages

  return (
    <Pagination className={cn('justify-end')}>
      <PaginationContent className={cn('gap-2')}>
        <PaginationItem>
          <Button variant="outline" size="icon" className="p-0 !size-8" onClick={() => setPage(1)} disabled={isFirst}>
            <ChevronsLeftIcon className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            className="p-0 !size-8"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={isFirst}>
            <ChevronLeftIcon className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <span className="text-sm px-2 py-1 text-muted-foreground">
            Page {page} of {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            className="p-0 !size-8"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isLast}>
            <ChevronRightIcon className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            className="p-0 !size-8"
            onClick={() => setPage(totalPages)}
            disabled={isLast}>
            <ChevronsRightIcon className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
