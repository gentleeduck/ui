import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
// @ts-expect-error css
import '@gentleduck/motion/css'

import { lazy } from 'react'
import { atom, useAtomValue, useSetAtom } from '@gentleduck/state/primitive'
import { createDuckTable } from './table.hooks'
import { DuckTableBody } from './table-advanced'
import { TableDemo, TableDemo1 } from './table-example'
import { DuckTableOptions } from './table.types'
import React from 'react'

// import App from './App'
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

const invoices: DuckTableOptions<Headers>['data'] = [
  {
    id: 'INV001',
    invoice: 'INV001',
    method: 'Credit Card',
    status: 'Paid',
    amount: '$250.00',
  },
  {
    id: 'INV002',
    invoice: 'INV002',
    method: 'PayPal',
    status: 'Pending',
    amount: '$150.00',
  },
  {
    id: 'INV003',
    invoice: 'INV003',
    method: 'Bank Transfer',
    status: 'Unpaid',
    amount: '$350.00',
  },
  {
    id: 'INV004',
    invoice: 'INV004',
    method: 'Credit Card',
    status: 'Paid',
    amount: '$450.00',
  },
  {
    id: 'INV005',
    invoice: 'INV005',
    method: 'PayPal',
    status: 'Paid',
    amount: '$550.00',
  },
  {
    id: 'INV006',
    invoice: 'INV006',
    method: 'Bank Transfer',
    status: 'Pending',
    amount: '$200.00',
  },
  {
    id: 'INV007',
    invoice: 'INV007',
    method: 'Credit Card',
    status: 'Unpaid',
    amount: '$300.00',
  },
]

const headers: DuckTableOptions<Headers>['headers'] = {
  invoice: { value: 'invoice', visible: true, sortable: true, direction: 'none' },
  method: { value: 'method', visible: true, sortable: true, direction: 'none' },
  status: { value: 'status', visible: true, sortable: true, direction: 'none' },
  amount: { value: 'amount', visible: true, sortable: true, direction: 'none' },
}

type Headers = ['invoice', 'status', 'method', 'amount']

const table_data: DuckTableOptions<Headers> = {
  headers,
  data: invoices,
  pageSize: 30,
  query: '',

  sort: [
    // {
    //   label: 'invoice',
    //   direction: 'asc',
    // },
  ],
  storageKey: 'invoices',
}

export const duck_table = createDuckTable<Headers>(table_data)

export function MyTable() {
  return (
    <div>
      <TableDemo />
    </div>
  )
}
