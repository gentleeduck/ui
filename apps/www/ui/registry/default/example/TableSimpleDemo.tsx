import { TableCustomView, TableHeaderType, TableContentDataType, FooterColumnType } from '../ui'

import { cn } from '@/lib'

export type TableDataType = {
  invoice: React.ReactNode | string
  status: React.ReactNode | string
  method: React.ReactNode | string
  amount: React.ReactNode | string
}

export type HeaderColumns = 'invoice' | 'status' | 'amount' | 'method'
const columns: TableHeaderType<true, TableDataType>[] = [
  {
    label: 'invoice',
    className: 'text-sm',
  },
  {
    label: 'status',
    className: 'w-[110px] text-sm',
  },
  {
    label: 'method',
    className: 'w-[70px] text-sm',
  },
  {
    label: 'amount',
    className: 'w-[90px] text-sm',
  },
]

const footerColumns: FooterColumnType[] = [
  {
    children: 'Total',
    colSpan: 3,
  },
  {
    children: '50000$',
    className: 'w-[170px]',
  },
]

export default function DataTableMainDemo() {
  return (
    <>
      <TableCustomView<true, TableDataType>
        wrapper={{
          className: cn('xl:w-[642px] lg:w-[524px] w-[270px] m-auto '),
        }}
        table={{
          className: cn('xl:w-[642px] lg:w-[524px] w-[270px]', footerColumns.length && 'rounded-none border-[0]'),
        }}
        footer={{
          className: 'gap-4 border-t-0',
          columns: footerColumns,
          children: 'Footer',
        }}
        header={columns}
        tableContentData={[...tableData]}
        caption={{
          children: 'A list of your recent invoices.',
        }}
      />
    </>
  )
}

export const tableData: TableContentDataType<TableDataType>[] = [
  {
    invoice: { children: 'INV001' },
    status: { children: 'Paid' },
    method: { children: 'Credit Card' },
    amount: { children: '$250.00' },
  },
  {
    invoice: { children: 'INV002' },
    status: { children: 'Pending' },
    method: { children: 'PayPal' },
    amount: { children: '$150.00' },
  },
  {
    invoice: { children: 'INV003' },
    status: { children: 'Unpaid' },
    method: { children: 'Bank Transfer' },
    amount: { children: '$350.00' },
  },
  {
    invoice: { children: 'INV004' },
    status: { children: 'Paid' },
    method: { children: 'Credit Card' },
    amount: { children: '$450.00' },
  },
  {
    invoice: { children: 'INV005' },
    status: { children: 'Paid' },
    method: { children: 'PayPal' },
    amount: { children: '$550.00' },
  },
  {
    invoice: { children: 'INV006' },
    status: { children: 'Pending' },
    method: { children: 'Bank Transfer' },
    amount: { children: '$200.00' },
  },
  {
    invoice: { children: 'INV007' },
    status: { children: 'Unpaid' },
    method: { children: 'Credit Card' },
    amount: { children: '$300.00' },
  },
]
