import { cn } from '@gentleduck/libs/cn'
import type { FC } from 'react'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {}

export const Table: FC<TableProps> = ({ className, ...props }) => (
  <div className="my-6 w-full rounded-lg border">
    <table
      className={cn(
        'relative w-full overflow-hidden border-none text-sm [&_tbody_tr:last-child]:border-b-0',
        className,
      )}
      {...props}
    />
  </div>
)

export const TableRow: FC<TableRowProps> = ({ className, ...props }) => (
  <tr className={cn('m-0 border-b', className)} {...props} />
)

export const TableHeader: FC<TableCellProps> = ({ className, ...props }) => (
  <th
    className={cn('px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right', className)}
    {...props}
  />
)

export const TableCell: FC<TableCellProps> = ({ className, ...props }) => (
  <td
    className={cn(
      'whitespace-nowrap px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
      className,
    )}
    {...props}
  />
)
