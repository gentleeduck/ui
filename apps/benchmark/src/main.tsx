import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
// @ts-expect-error css
import '@gentleduck/motion/css'

import { atom, useAtomValue, useSetAtom } from '@gentleduck/state/primitive'
import React, { lazy } from 'react'
import App from './App'
import { createDuckTable } from './table.hooks'
import { DuckTableOptions } from './table.types'
import { DuckTableBody } from './table-advanced'
import { DucKTable, TableDemo } from './table-example'

// const App = lazy(() => import('./App'))

createRoot(document.getElementById('root') as HTMLElement).render(<TableDemor />)

export function TableDemor() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <MyTable />
    </div>
  )
}

type Invoices = {
  invoice: string
  paymentStatus: string
  totalAmount: string
  paymentMethod: string
}

const invoices: DuckTableOptions<Headers>['rows'] = [
  {
    amount: '$250.00',
    id: 'INV001',
    invoice: 'INV001',
    method: 'Credit Card',
    status: 'Paid',
  },
  {
    amount: '$150.00',
    id: 'INV002',
    invoice: 'INV002',
    method: 'PayPal',
    status: 'Pending',
  },
  {
    amount: '$350.00',
    id: 'INV003',
    invoice: 'INV003',
    method: 'Bank Transfer',
    status: 'Unpaid',
  },
  {
    amount: '$450.00',
    id: 'INV004',
    invoice: 'INV004',
    method: 'Credit Card',
    status: 'Paid',
  },
  {
    amount: '$550.00',
    id: 'INV005',
    invoice: 'INV005',
    method: 'PayPal',
    status: 'Paid',
  },
  {
    amount: '$200.00',
    id: 'INV006',
    invoice: 'INV006',
    method: 'Bank Transfer',
    status: 'Pending',
  },
  {
    amount: '$300.00',
    id: 'INV007',
    invoice: 'INV007',
    method: 'Credit Card',
    status: 'Unpaid',
  },
  {
    amount: '$400.00',
    id: 'INV008',
    invoice: 'INV008',
    method: 'PayPal',
    status: 'Paid',
  },
  {
    amount: '$500.00',
    id: 'INV009',
    invoice: 'INV009',
    method: 'Bank Transfer',
    status: 'Pending',
  },
  {
    amount: '$600.00',
    id: 'INV010',
    invoice: 'INV010',
    method: 'Credit Card',
    status: 'Unpaid',
  },
]

const headers: DuckTableOptions<Headers>['columns'] = {
  amount: { direction: 'none', label: 'amount', sortable: true, visible: true },
  invoice: { direction: 'none', label: 'invoice', sortable: true, visible: true },
  method: {
    direction: 'none',
    enum: ['Credit Card', 'PayPal', 'Bank Transfer'] as const,
    label: 'method',
    sortable: true,
    visible: true,
  },
  status: {
    direction: 'none',
    enum: ['Paid', 'Pending', 'Unpaid'] as const,
    label: 'status',
    sortable: true,
    visible: true,
  },
}

type Headers = ['invoice', 'status', 'method', 'amount']

const table_data: DuckTableOptions<Headers> = {
  columns: headers,
  pageSize: 5,
  query: '',
  rows: invoices,

  sortConfig: [],
}

export const duck_table = createDuckTable<Headers>(table_data)

export function MyTable() {
  return (
    <div>
      <TableDemo />
    </div>
  )
}
