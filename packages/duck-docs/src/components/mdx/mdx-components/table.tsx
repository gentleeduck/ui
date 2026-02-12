import { cn } from '@gentleduck/libs/cn'
import type { FC } from 'react'

export const Table: FC<React.HTMLAttributes<HTMLTableElement>> = ({ className, ...props }) => (
  <div className="my-6 w-full overflow-x-auto rounded-lg border">
    <table
      className={cn('relative w-full border-none text-sm [&_tbody_tr:last-child]:border-b-0', className)}
      {...props}
    />
  </div>
)

export const TableRow: FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className, ...props }) => (
  <tr className={cn('m-0 border-b', className)} {...props} />
)

export const TableHeader: FC<React.HTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
  <th
    className={cn('px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right', className)}
    {...props}
  />
)

export const TableCell: FC<React.HTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
  <td
    className={cn(
      'whitespace-nowrap px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
      className,
    )}
    {...props}
  />
)
