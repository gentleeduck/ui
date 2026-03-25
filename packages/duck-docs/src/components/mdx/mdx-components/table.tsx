import { cn } from '@gentleduck/libs/cn'

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-lg border">
      <table
        className={cn('relative w-full border-none text-sm [&_tbody_tr:last-child]:border-b-0', className)}
        {...props}
      />
    </div>
  )
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('m-0 border-b', className)} {...props} />
}

export function TableHeader({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right', className)}
      scope="col"
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'whitespace-nowrap px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  )
}
