import { ChartPie, ToggleLeft } from 'lucide-react'
import { DuckTable, DuckTablePagination, DuckTableRowPerPage, DuckTableSelectedRows } from './table-advanced'
import {
  DuckTableColumnView,
  DuckTableFilter,
  DuckTableBar,
  DuckTableLeftSide,
  DuckTableRightSide,
  DuckTableSearch,
} from './table-advanced.chunks'
const hi = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
] as const

export function TableDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <DuckTable<Invoices> className="w-[765px] flex flex-col gap-4 border rounded-md p-4" table={duck_table}>
        <DuckTableBar>
          <DuckTableRightSide>
            <DuckTableSearch />
            <DuckTableFilter<typeof hi>
              trigger={{
                children: (
                  <>
                    <ChartPie className="!size-4" />
                    <span>Status</span>
                  </>
                ),
              }}
              onValueChange={(value) => console.log(value)}
              items={[
                {
                  label: 'All',
                  value: 'all',
                },
                {
                  label: 'Active',
                  value: 'active',
                },
                {
                  label: 'Inactive',
                  value: 'inactive',
                },
              ]}
              heading="Filter Status"
            />
            <DuckTableFilter
              trigger={{
                children: (
                  <>
                    <ChartPie className="!size-4" />
                    <span>Status</span>
                  </>
                ),
              }}
              onValueChange={(value) => console.log(value)}
              items={[
                {
                  label: 'Inactive',
                  value: 'inactive',
                },
              ]}
              heading="Filter Priority"
            />
          </DuckTableRightSide>

          <DuckTableLeftSide>
            <DuckTableColumnView
              trigger={{
                variant: 'default',
                children: (
                  <>
                    <ToggleLeft className="!size-5" />
                    <span>View</span>
                  </>
                ),
              }}
              onValueChange={(value) => console.log(value)}
              items={[
                {
                  label: 'Task',
                  value: 'task',
                },
                {
                  label: 'Title',
                  value: 'title',
                },
                {
                  label: 'Label',
                  value: 'label',
                },
                {
                  label: 'Status',
                  value: 'status',
                },
                {
                  label: 'Priority',
                  value: 'priority',
                },
              ]}
              heading="Select Columns"
            />
          </DuckTableLeftSide>
        </DuckTableBar>
        <TableDemo1 />

        <DuckTableBar>
          <DuckTableRightSide>
            <DuckTableSelectedRows table={table} />
          </DuckTableRightSide>

          <DuckTableLeftSide className="gap-8">
            <DuckTableRowPerPage<Invoices> atoms={duck_table.atoms} actions={duck_table.actions} />
            <DuckTablePagination<Invoices> actions={duck_table.actions} atoms={duck_table.atoms} />
          </DuckTableLeftSide>
        </DuckTableBar>
      </DuckTable>
    </div>
  )
}

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table'
import { DuckTable as D } from './table.libs'
import React from 'react'
import { createDuckTable, useAtom, useAtomValue } from './table.atom'

type Invoices = {
  invoice: string
  paymentStatus: string
  totalAmount: string
  paymentMethod: string
}

const invoices = [
  {
    id: 'INV001',
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'INV002',
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    id: 'INV003',
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'INV004',
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'INV005',
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    id: 'INV006',
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'INV007',
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
]

export const table = new D<Invoices>({
  data: invoices,
  pageSize: 5,
  initialSort: [{ column: 'invoice', direction: 'asc' }],
})
export const duck_table = createDuckTable<Invoices>(invoices)

export function TableDemo1() {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <DuckTableBody />

        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export function DuckTableHeader<TRow extends Record<string, unknown>>({
  headers,
}: {
  headers: ReturnType<typeof createDuckTable<TRow>>['atoms']
}) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Method</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
  )
}

export function DuckTableBody() {
  const rows = useAtom(duck_table.atoms.rows)
  const query = useAtomValue(duck_table.atoms.query)
  const newRows = rows.filter((invoice) => JSON.stringify(invoice).toLowerCase().includes(query.toLowerCase()))

  return (
    <TableBody>
      {newRows.length ? (
        newRows.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} className="text-center">
            No results found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
