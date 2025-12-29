'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui-duckui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@gentleduck/registry-ui-duckui/table'
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import * as React from 'react'

const data: Payment[] = [
  {
    amount: 316,
    email: 'ken99@example.com',
    id: 'm5gr84i9',
    status: 'success',
  },
  {
    amount: 242,
    email: 'Abe45@example.com',
    id: '3u1reuv4',
    status: 'success',
  },
  {
    amount: 837,
    email: 'Monserrat44@example.com',
    id: 'derv1ws0',
    status: 'processing',
  },
  {
    amount: 721,
    email: 'carmella@example.com',
    id: 'bhqecj4p',
    status: 'failed',
  },
  {
    amount: 450,
    email: 'jason78@example.com',
    id: 'k9f2m3n4',
    status: 'pending',
  },
  {
    amount: 1280,
    email: 'sarah23@example.com',
    id: 'p5q6r7s8',
    status: 'success',
  },
]

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    id: 'select',
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => <div className="capitalize">{row.getValue('status')}</div>,
    header: 'Status',
  },
  {
    accessorKey: 'email',
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        currency: 'USD',
        style: 'currency',
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
    header: () => <div className="text-right">Amount</div>,
  },
  {
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu placement="bottom-end">
          <DropdownMenuTrigger asChild>
            <Button className="size-8 p-0" variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: false,
    id: 'actions',
  },
]

export function CardsPayments() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Payments</CardTitle>
        <CardDescription>Manage your payments.</CardDescription>
        <Button className="shadow-none" size="sm" variant="secondary">
          Add Payment
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="data-[name=actions]:w-10 data-[name=amount]:w-24 data-[name=select]:w-10 data-[name=status]:w-24 [&:has([role=checkbox])]:pl-3"
                        data-name={header.id}
                        key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="data-[name=actions]:w-10 data-[name=amount]:w-24 data-[name=select]:w-10 data-[name=status]:w-24 [&:has([role=checkbox])]:pl-3"
                        data-name={cell.column.id}
                        key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center" colSpan={columns.length}>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="flex-1 text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="flex gap-2">
            <Button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="sm"
              variant="outline">
              Previous
            </Button>
            <Button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} size="sm" variant="outline">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
