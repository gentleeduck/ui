import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@gentleduck/registry-ui-duckui/alert-dialog'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui-duckui/dropdown-menu'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Pagination, PaginationContent, PaginationItem } from '@gentleduck/registry-ui-duckui/pagination'
import { Portal } from '@gentleduck/registry-ui-duckui/portal'
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
import { useAtom, useAtomValue } from '@gentleduck/state/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
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

  return (
    <div className={cn('flex items-center gap-2', className)} duck-table-row-per-page="" {...props}>
      <Label className="text-nowrap text-sm">Rows per page</Label>
      <Select
        onValueChange={(value) => {
          setPageSize(Number(value))
        }}
        value={String(pageSize)}>
        <SelectTrigger className="px-2 w-[70px] h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-[65px] py-2">
          <SelectGroup>
            {options.map((item) => (
              <SelectItem className="h-4" key={item} value={String(item)}>
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
    <div className={cn('flex items-center gap-2', className)} duck-table-selected-rows="" {...props}>
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
            className="p-0 !size-8"
            disabled={isFirst}
            onClick={() => setPage(() => 1)}
            size="icon"
            variant="outline">
            <ChevronsLeftIcon className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            className="p-0 !size-8"
            disabled={isFirst}
            onClick={() => setPage((prev) => prev - 1)}
            size="icon"
            variant="outline">
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
            className="p-0 !size-8"
            disabled={isLast}
            onClick={() => setPage((prev) => prev + 1)}
            size="icon"
            variant="outline">
            <ChevronRightIcon className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            className="p-0 !size-8"
            disabled={isLast}
            onClick={() => setPage(() => totalPages)}
            size="icon"
            variant="outline">
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
      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
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
        checked={
          selectedRows.length < mutatedRows.length && selectedRows.length > 0
            ? 'indeterminate'
            : selectedRows.length === mutatedRows.length && mutatedRows.length > 0
              ? true
              : false
        }
        className="border-border"
        disabled={mutatedRows.length === 0}
        onCheckedChange={(value) => {
          if (value) {
            setSelectedRows(mutatedRows.map((row) => row.id))
          } else {
            setSelectedRows([])
          }
        }}
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
                className={cn(
                  'whitespace-nowrap text-ellipsis capitalize',
                  key === colCount - 1 && 'text-right pr-3',
                  header.sortable && key === colCount - 1 && 'pr-0',
                  header.sortable && key === 0 && 'pl-4',
                  header.sortable && key !== colCount - 1 && '!px-0',
                )}
                key={header.label}
                style={{
                  maxWidth: cellWidth,
                  width: cellWidth,
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
        checked={selectedRows.includes(id)}
        className="border-border"
        onCheckedChange={(value) => {
          if (value) {
            setSelectedRows((prev) => [...prev, id])
          } else {
            setSelectedRows((prev) => prev.filter((row) => row !== id))
          }
        }}
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
                      <TableCell className="pl-3" key={key + 'checkbox'}>
                        <RowCheckboxSelect id={row.id} />
                      </TableCell>
                    )}
                    <TableCell
                      className={cn(
                        key === 0 && 'w-[100px]',
                        key === Object.keys(_row).length - 1 && 'text-right pr-3',
                      )}
                      key={key}>
                      {key !== Object.keys(_row).length - 1 ? (
                        value
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {value}
                          <DuckTableRowActions id={row.id} />
                        </div>
                      )}
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

export function DuckTableRowActions({ id }: { id: string }) {
  // const [rows, setRows] = useAtom(duck_table.atoms.rows)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-sm px-1" icon={<MoreHorizontal />} size={'icon'} variant={'ghost'}></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-start pb-0">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<Pencil />} size={'sm'}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DuckTableActionsDelete />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export function DuckTableActionsDelete() {
  const [open, setOpen] = React.useState(false)
  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
        <DropdownMenuItem className="" icon={<Trash2 />} size={'sm'} variant={'nothing'}>
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <Portal>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center gap-2 justify-end">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Portal>
    </AlertDialog>
  )
}

export function DuckTableBodyNotFound() {
  const visibleColumns = useAtomValue(duck_table.atoms.visibleColumns)
  return (
    <TableRow>
      <TableCell className="text-center" colSpan={visibleColumns.length + 1}>
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
