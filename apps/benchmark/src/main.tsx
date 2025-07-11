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
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
  },
  {
    id: 'INV002',
    invoice: 'INV002',
    paymentMethod: 'PayPal',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
  },
  {
    id: 'INV003',
    invoice: 'INV003',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
  },
  {
    id: 'INV004',
    invoice: 'INV004',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
  },
  {
    id: 'INV005',
    invoice: 'INV005',
    paymentMethod: 'PayPal',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
  },
  {
    id: 'INV006',
    invoice: 'INV006',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
  },
  {
    id: 'INV007',
    invoice: 'INV007',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
  },
]

const headers = {
  invoice: { value: 'Invoice', visible: true },
  totalAmount: { value: 'Method', visible: true },
  paymentStatus: { value: 'Status', visible: true },
  paymentMethod: { value: 'Amount', visible: true },
}

type Headers = ['invoice', 'paymentStatus', 'totalAmount', 'paymentMethod']

const table_data: DuckTableOptions<Headers> = {
  headers,
  data: invoices,
  pageSize: 3,
  query: '',
  sort: [
    {
      column: 'invoice',
      direction: 'asc',
    },
  ],
}

export const duck_table = createDuckTable<Headers>(table_data)

export function MyTable() {
  return (
    <div>
      <TableDemo />
    </div>
  )
}
