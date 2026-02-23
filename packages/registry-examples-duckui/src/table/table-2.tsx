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
    paymentMethod: 'Apple Pay',
    paymentStatus: '\u063A\u064A\u0631 \u0645\u062F\u0641\u0648\u0639',
    totalAmount: '$180.00',
  },
  {
    invoice: 'INV102',
    paymentMethod: '\u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062A\u0645\u0627\u0646',
    paymentStatus: '\u0645\u062F\u0641\u0648\u0639',
    totalAmount: '$720.00',
  },
  {
    invoice: 'INV103',
    paymentMethod: 'PayPal',
    paymentStatus: '\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631',
    totalAmount: '$95.00',
  },
  {
    invoice: 'INV104',
    paymentMethod: '\u062A\u062D\u0648\u064A\u0644 \u0628\u0646\u0643\u064A',
    paymentStatus: '\u0645\u062F\u0641\u0648\u0639',
    totalAmount: '$1,250.00',
  },
  {
    invoice: 'INV105',
    paymentMethod: '\u0628\u0637\u0627\u0642\u0629 \u062E\u0635\u0645',
    paymentStatus: '\u063A\u064A\u0631 \u0645\u062F\u0641\u0648\u0639',
    totalAmount: '$430.00',
  },
  {
    invoice: 'INV106',
    paymentMethod: 'Apple Pay',
    paymentStatus: '\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631',
    totalAmount: '$610.00',
  },
  {
    invoice: 'INV107',
    paymentMethod: 'Google Pay',
    paymentStatus: '\u0645\u062F\u0641\u0648\u0639',
    totalAmount: '$390.00',
  },
]

export default function TableRtlDemo() {
  return (
    <div dir="rtl">
      <Table>
        <TableCaption>
          {
            '\u0642\u0627\u0626\u0645\u0629 \u0628\u0641\u0648\u0627\u062A\u064A\u0631\u0643 \u0627\u0644\u0623\u062E\u064A\u0631\u0629.'
          }
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{'\u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629'}</TableHead>
            <TableHead>{'\u0627\u0644\u062D\u0627\u0644\u0629'}</TableHead>
            <TableHead>{'\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639'}</TableHead>
            <TableHead className="text-left">{'\u0627\u0644\u0645\u0628\u0644\u063A'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-left">{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>{'\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A'}</TableCell>
            <TableCell className="text-left">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
