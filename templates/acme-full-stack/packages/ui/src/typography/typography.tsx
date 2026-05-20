'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

const h1ClassName = 'scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl'
const h2ClassName = 'scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight transition-colors first:mt-0'
const h3ClassName = 'scroll-m-20 font-semibold text-2xl tracking-tight'
const h4ClassName = 'scroll-m-20 font-semibold text-xl tracking-tight'
const pClassName = 'leading-7 [&:not(:first-child)]:mt-6'
const blockquoteClassName = 'mt-6 border-l-2 pl-6 italic rtl:border-r-2 rtl:border-l-0 rtl:pr-6 rtl:pl-0'
const listClassName = 'my-6 ml-6 list-disc [&>li]:mt-2 rtl:mr-6 rtl:ml-0'
const inlineCodeClassName = 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm'
const leadClassName = 'text-muted-foreground text-xl'
const largeClassName = 'font-semibold text-lg'
const smallClassName = 'font-medium text-sm leading-none'
const mutedClassName = 'text-muted-foreground text-sm'
const tableWrapperClassName = 'my-6 w-full overflow-y-auto'
const tableClassName = 'w-full'
const trClassName = 'm-0 border-t p-0 even:bg-muted'
const thClassName =
  'border px-4 py-2 text-left font-bold rtl:text-right [&[align=center]]:text-center [&[align=right]]:text-right'
const tdClassName =
  'border px-4 py-2 text-left rtl:text-right [&[align=center]]:text-center [&[align=right]]:text-right'

const TypographyH1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} data-slot="typography-h1" className={cn(h1ClassName, className)} {...props} />
  ),
)
TypographyH1.displayName = 'TypographyH1'

const TypographyH2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} data-slot="typography-h2" className={cn(h2ClassName, className)} {...props} />
  ),
)
TypographyH2.displayName = 'TypographyH2'

const TypographyH3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} data-slot="typography-h3" className={cn(h3ClassName, className)} {...props} />
  ),
)
TypographyH3.displayName = 'TypographyH3'

const TypographyH4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} data-slot="typography-h4" className={cn(h4ClassName, className)} {...props} />
  ),
)
TypographyH4.displayName = 'TypographyH4'

const TypographyP = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} data-slot="typography-p" className={cn(pClassName, className)} {...props} />
  ),
)
TypographyP.displayName = 'TypographyP'

const TypographyBlockquote = React.forwardRef<HTMLQuoteElement, React.HTMLAttributes<HTMLQuoteElement>>(
  ({ className, ...props }, ref) => (
    <blockquote ref={ref} data-slot="typography-blockquote" className={cn(blockquoteClassName, className)} {...props} />
  ),
)
TypographyBlockquote.displayName = 'TypographyBlockquote'

const TypographyList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} data-slot="typography-list" className={cn(listClassName, className)} {...props} />
  ),
)
TypographyList.displayName = 'TypographyList'

const TypographyInlineCode = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <code ref={ref} data-slot="typography-inline-code" className={cn(inlineCodeClassName, className)} {...props} />
  ),
)
TypographyInlineCode.displayName = 'TypographyInlineCode'

const TypographyLead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} data-slot="typography-lead" className={cn(leadClassName, className)} {...props} />
  ),
)
TypographyLead.displayName = 'TypographyLead'

const TypographyLarge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="typography-large" className={cn(largeClassName, className)} {...props} />
  ),
)
TypographyLarge.displayName = 'TypographyLarge'

const TypographySmall = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <small ref={ref} data-slot="typography-small" className={cn(smallClassName, className)} {...props} />
  ),
)
TypographySmall.displayName = 'TypographySmall'

const TypographyMuted = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} data-slot="typography-muted" className={cn(mutedClassName, className)} {...props} />
  ),
)
TypographyMuted.displayName = 'TypographyMuted'

const TypographyTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { wrapperClassName?: string }
>(({ className, wrapperClassName, children, ...props }, ref) => (
  <div className={cn(tableWrapperClassName, wrapperClassName)}>
    <table ref={ref} data-slot="typography-table" className={cn(tableClassName, className)} {...props}>
      {children}
    </table>
  </div>
))
TypographyTable.displayName = 'TypographyTable'

const TypographyTr = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} data-slot="typography-tr" className={cn(trClassName, className)} {...props} />
  ),
)
TypographyTr.displayName = 'TypographyTr'

const TypographyTh = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} data-slot="typography-th" className={cn(thClassName, className)} {...props} />
  ),
)
TypographyTh.displayName = 'TypographyTh'

const TypographyTd = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} data-slot="typography-td" className={cn(tdClassName, className)} {...props} />
  ),
)
TypographyTd.displayName = 'TypographyTd'

export {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographySmall,
  TypographyTable,
  TypographyTd,
  TypographyTh,
  TypographyTr,
}
