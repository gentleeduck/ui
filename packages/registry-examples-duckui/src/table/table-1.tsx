import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@gentleduck/registry-ui-duckui/table'

const invoices = [
  {
    invoice: 'INV101',
    paymentStatus: 'Unpaid',
    totalAmount: '$180.00',
    paymentMethod: 'Apple Pay',
  },
  {
    invoice: 'INV102',
    paymentStatus: 'Paid',
    totalAmount: '$720.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV103',
    paymentStatus: 'Pending',
    totalAmount: '$95.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV104',
    paymentStatus: 'Paid',
    totalAmount: '$1,250.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV105',
    paymentStatus: 'Unpaid',
    totalAmount: '$430.00',
    paymentMethod: 'Debit Card',
  },
  {
    invoice: 'INV106',
    paymentStatus: 'Pending',
    totalAmount: '$610.00',
    paymentMethod: 'Apple Pay',
  },
  {
    invoice: 'INV107',
    paymentStatus: 'Paid',
    totalAmount: '$390.00',
    paymentMethod: 'Google Pay',
  },
]

export default function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
