import { cn } from '@/lib'
import { FooterColumnType, TableContentDataType, TableCustomView, TableHeaderType } from '../ui'

export type TableDataType = {
  invoice: React.ReactNode | string
  status: React.ReactNode | string
  method: React.ReactNode | string
  amount: React.ReactNode | string
}

export type HeaderColumns = 'invoice' | 'status' | 'amount' | 'method'
const columns: TableHeaderType<true, TableDataType>[] = [
  {
    className: 'text-sm',
    label: 'invoice',
  },
  {
    className: 'w-[110px] text-sm',
    label: 'status',
  },
  {
    className: 'w-[70px] text-sm',
    label: 'method',
  },
  {
    className: 'w-[90px] text-sm',
    label: 'amount',
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
        caption={{
          children: 'A list of your recent invoices.',
        }}
        footer={{
          children: 'Footer',
          className: 'gap-4 border-t-0',
          columns: footerColumns,
        }}
        header={columns}
        table={{
          className: cn('xl:w-[642px] lg:w-[524px] w-[270px]', footerColumns.length && 'rounded-none border-[0]'),
        }}
        tableContentData={[...tableData]}
        wrapper={{
          className: cn('xl:w-[642px] lg:w-[524px] w-[270px] m-auto '),
        }}
      />
    </>
  )
}

export const tableData: TableContentDataType<TableDataType>[] = [
  {
    amount: { children: '$250.00' },
    invoice: { children: 'INV001' },
    method: { children: 'Credit Card' },
    status: { children: 'Paid' },
  },
  {
    amount: { children: '$150.00' },
    invoice: { children: 'INV002' },
    method: { children: 'PayPal' },
    status: { children: 'Pending' },
  },
  {
    amount: { children: '$350.00' },
    invoice: { children: 'INV003' },
    method: { children: 'Bank Transfer' },
    status: { children: 'Unpaid' },
  },
  {
    amount: { children: '$450.00' },
    invoice: { children: 'INV004' },
    method: { children: 'Credit Card' },
    status: { children: 'Paid' },
  },
  {
    amount: { children: '$550.00' },
    invoice: { children: 'INV005' },
    method: { children: 'PayPal' },
    status: { children: 'Paid' },
  },
  {
    amount: { children: '$200.00' },
    invoice: { children: 'INV006' },
    method: { children: 'Bank Transfer' },
    status: { children: 'Pending' },
  },
  {
    amount: { children: '$300.00' },
    invoice: { children: 'INV007' },
    method: { children: 'Credit Card' },
    status: { children: 'Unpaid' },
  },
]
