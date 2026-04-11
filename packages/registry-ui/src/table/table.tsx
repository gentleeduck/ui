'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <div className="relative w-full overflow-auto" dir={direction}>
        <table className={cn('w-full caption-bottom text-sm', className)} data-slot="table" ref={ref} {...props} />
      </div>
    )
  },
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead className={cn('[&_tr]:border-b', className)} data-slot="table-header" ref={ref} {...props} />
  ),
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} data-slot="table-body" ref={ref} {...props} />
  ),
)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
      data-slot="table-footer"
      ref={ref}
      {...props}
    />
  ),
)
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      data-slot="table-row"
      ref={ref}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, scope = 'col', ...props }, ref) => (
    <th
      className={cn(
        'px-4 text-start align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pe-0',
        className,
      )}
      data-slot="table-head"
      ref={ref}
      scope={scope}
      {...props}
    />
  ),
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pe-0', className)}
      data-slot="table-cell"
      ref={ref}
      {...props}
    />
  ),
)
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      data-slot="table-caption"
      ref={ref}
      {...props}
    />
  ),
)
TableCaption.displayName = 'TableCaption'

/* ------------------------------------------------------------------ */
/*  Motion variants                                                     */
/* ------------------------------------------------------------------ */

const MOTION_TABLE_OPTIONS = { transition: springBouncy } as const
const MOTION_TABLE_ROW_STAGGER = 0.05

const MotionTable = React.forwardRef<
  HTMLTableElement,
  Omit<React.HTMLAttributes<HTMLTableElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
>(({ className, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  const content = useMotionPreset('scaleIn', MOTION_TABLE_OPTIONS)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        className="relative w-full overflow-auto"
        dir={direction}
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}>
        <table className={cn('w-full caption-bottom text-sm', className)} data-slot="table" ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionTable.displayName = 'MotionTable'

const MotionTableRow = React.forwardRef<
  HTMLTableRowElement,
  Omit<React.HTMLAttributes<HTMLTableRowElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> & {
    index?: number
  }
>(({ className, index = 0, ...props }, ref) => {
  const motionOptions = React.useMemo(
    () => ({ transition: springBouncy, delay: index * MOTION_TABLE_ROW_STAGGER }),
    [index],
  )
  const content = useMotionPreset('scaleIn', motionOptions)
  return (
    <m.tr
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      data-slot="table-row"
      ref={ref}
      initial={content.initial}
      animate={content.animate}
      transition={content.transition}
      {...props}
    />
  )
})
MotionTableRow.displayName = 'MotionTableRow'

export {
  MotionTable,
  MotionTableRow,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
