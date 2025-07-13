import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@gentleduck/registry-ui-duckui/table'
import { useAtom, useAtomValue } from '@gentleduck/state/primitive'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import React from 'react'
import { cn } from './lib/utils'
import { duck_table } from './main'
import { DuckTableSortable } from './table-advanced.chunks'

export function DuckTable({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & {}) {
  return (
    <div {...props} duck-table="">
      {children}
    </div>
  )
}

export function DuckTableRowPerPage({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [pageSize, setPageSize] = useAtom(duck_table.atoms.pageSize)

  const options = [5, 10, 20, 50, 100]

  console.log(pageSize)
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
              <SelectItem key={item} value={String(item)} className="h-4">
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
          <Button
            variant="outline"
            size="icon"
            className="p-0 !size-8"
            onClick={() => setPage(() => 1)}
            disabled={isFirst}>
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
            onClick={() => setPage(() => totalPages)}
            disabled={isLast}>
            <ChevronsRightIcon className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

/* Main Table */
export function DuckTableShape() {
  return (
    <div className="border rounded-md max- -[300px] overflow-auto">
      <Table style={{ width: '100%', tableLayout: 'fixed' }}>
        <DuckTableHeader />

        <DuckTableBody />
        <DuckTableBodyCaption />
      </Table>
    </div>
  )
}

export function DuckTableHeader() {
  const headers = useAtomValue(duck_table.atoms.columns)

  const visibleHeaders = Object.values(headers).filter((header) => header.visible)
  const colCount = visibleHeaders.length
  const cellWidth = `${100 / colCount}%`

  function HeahderCheckboxSelect() {
    const mutatedRows = useAtomValue(duck_table.atoms.mutatedRows)
    const [selectedRows, setSelectedRows] = useAtom(duck_table.atoms.selectedRows)

    return (
      <Checkbox
        className="border-border"
        disabled={mutatedRows.length === 0}
        onChange={(e) => {
          if (e.currentTarget.checked) {
            setSelectedRows(mutatedRows.map((row) => row.id))
          } else {
            setSelectedRows([])
          }
        }}
        checked={
          selectedRows.length < mutatedRows.length && selectedRows.length > 0
            ? 'indeterminate'
            : selectedRows.length === mutatedRows.length && mutatedRows.length > 0
              ? true
              : false
        }
      />
    )
  }

  return (
    <TableHeader>
      <TableRow className="[&:has(th>input:disabled)>th]:pointer-events-none [&:has(th>input:disabled)>th]:cursor-not-allowed [&:has(th>input:disabled)>th]:opacity-50">
        {visibleHeaders.map((header, key) => {
          return (
            <React.Fragment key={key}>
              {key === 0 && (
                <TableHead className="w-[35px] pl-3">
                  <HeahderCheckboxSelect />
                </TableHead>
              )}
              <TableHead
                key={header.label}
                className={cn(
                  'whitespace-nowrap text-ellipsis capitalize',
                  key === colCount - 1 && 'text-right pr-3',
                  header.sortable && key === colCount - 1 && 'pr-0',
                  header.sortable && key === 0 && 'pl-4',
                  header.sortable && key !== colCount - 1 && '!px-0',
                )}
                style={{
                  width: cellWidth,
                  maxWidth: cellWidth,
                }}>
                {header.sortable ? <DuckTableSortable header={header} /> : header.label}
              </TableHead>
            </React.Fragment>
          )
        })}
      </TableRow>
    </TableHeader>
  )
}

export function DuckTableBody() {
  const rows = useAtomValue(duck_table.atoms.currentPageRows)
  const columns = useAtomValue(duck_table.atoms.columns)

  const visibleKeys = Object.entries(columns)
    .filter(([_, config]) => config.visible)
    .map(([key]) => key)

  function RowCheckboxSelect({ id }: { id: (typeof rows)[number]['id'] }) {
    const [selectedRows, setSelectedRows] = useAtom(duck_table.atoms.selectedRows)

    return (
      <Checkbox
        className="border-border"
        onChange={(e) => {
          if (e.currentTarget.checked) {
            setSelectedRows((prev) => [...prev, id])
          } else {
            setSelectedRows((prev) => prev.filter((row) => row !== id))
          }
        }}
        checked={selectedRows.includes(id)}
      />
    )
  }

  return (
    <TableBody>
      {rows.length ? (
        rows.map((row, key) => {
          const _row = Object.fromEntries(
            Object.entries(row).filter(([key]) => visibleKeys.includes(key)),
          ) as typeof row
          return (
            <TableRow key={key}>
              {Object.values(_row as Record<string, string>).map((value, key) => {
                return (
                  <React.Fragment key={key}>
                    {key === 0 && (
                      <TableCell key={key + 'checkbox'} className="pl-3">
                        <RowCheckboxSelect id={row.id} />
                      </TableCell>
                    )}
                    <TableCell
                      key={key}
                      className={cn(
                        key === 0 && 'w-[100px]',
                        key === Object.keys(_row).length - 1 && 'text-right pr-3',
                      )}>
                      {value}
                    </TableCell>
                  </React.Fragment>
                )
              })}
            </TableRow>
          )
        })
      ) : (
        <DuckTableBodyNotFound />
      )}
    </TableBody>
  )
}

export function DuckTableBodyNotFound() {
  const visibleColumns = useAtomValue(duck_table.atoms.visibleColumns)
  return (
    <TableRow>
      <TableCell colSpan={visibleColumns.length + 1} className="text-center">
        No results found
      </TableCell>
    </TableRow>
  )
}

export function DuckTableBodyCaption() {
  const visibleColumns = useAtomValue(duck_table.atoms.visibleColumns)
  return (
    <TableFooter>
      <TableRow>
        <TableCell className="pl-3" colSpan={visibleColumns.length}>
          Total
        </TableCell>
        <TableCell className="text-right pr-3">$2,500.00</TableCell>
      </TableRow>
    </TableFooter>
  )
}
