import { cn } from '@gentleduck/libs/cn'
import React from 'react'

const Table = ({ className, ref, ...props }: React.HTMLProps<HTMLTableElement>) => (
  <div className="relative w-full overflow-auto" role="region" aria-label="Table container" duck-table="">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} role="table" />
  </div>
)

const TableHeader = ({ className, ref, ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} role="rowgroup" duck-table-header="" />
)

const TableBody = ({ className, ref, ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
    role="rowgroup"
    duck-table-body=""
  />
)

const TableFooter = ({ className, ref, ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
  <tfoot
    ref={ref}
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
    role="rowgroup"
    duck-table-footer=""
  />
)

const TableRow = ({ className, ref, ...props }: React.HTMLProps<HTMLTableRowElement>) => (
  <tr
    ref={ref}
    className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
    {...props}
    role="row"
    duck-table-row=""
  />
)

const TableHead = ({ className, ref, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
    scope="col"
    role="columnheader"
    duck-table-head=""
  />
)

const TableCell = ({ className, ref, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
    role="cell"
    duck-table-cell=""
  />
)

const TableCaption = ({ className, ref, ...props }: React.HTMLProps<HTMLTableCaptionElement>) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
    aria-live="polite"
    duck-table-caption=""
  />
)

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption }
