import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

function Table({ className, ref, ...props }: React.HTMLProps<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} data-slot="table" ref={ref} {...props} />
    </div>
  )
}

function TableHeader({ className, ref, ...props }: React.HTMLProps<HTMLTableSectionElement>) {
  return <thead className={cn('[&_tr]:border-b', className)} data-slot="table-header" ref={ref} {...props} />
}

function TableBody({ className, ref, ...props }: React.HTMLProps<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} data-slot="table-body" ref={ref} {...props} />
}

function TableFooter({ className, ref, ...props }: React.HTMLProps<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
      data-slot="table-footer"
      ref={ref}
      {...props}
    />
  )
}

function TableRow({ className, ref, ...props }: React.HTMLProps<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      data-slot="table-row"
      ref={ref}
      {...props}
    />
  )
}

function TableHead({ className, ref, ...props }: React.HTMLProps<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className,
      )}
      data-slot="table-head"
      ref={ref}
      {...props}
    />
  )
}

function TableCell({ className, ref, ...props }: React.HTMLProps<HTMLTableCellElement>) {
  return (
    <td
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      data-slot="table-cell"
      ref={ref}
      {...props}
    />
  )
}

function TableCaption(
  { className, ...props }: React.HTMLProps<HTMLTableCaptionElement>,
  ref: React.Ref<HTMLTableCaptionElement>,
) {
  return (
    <caption
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      data-slot="table-caption"
      ref={ref}
      {...props}
    />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption }
