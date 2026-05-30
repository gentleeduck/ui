'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'
import { typographyVariants } from './typography.constants'

const TypographyH1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} data-slot="typography-h1" className={cn(typographyVariants({ level: 'h1' }), className)} {...props} />
  ),
)
TypographyH1.displayName = 'TypographyH1'

const TypographyH2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} data-slot="typography-h2" className={cn(typographyVariants({ level: 'h2' }), className)} {...props} />
  ),
)
TypographyH2.displayName = 'TypographyH2'

const TypographyH3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} data-slot="typography-h3" className={cn(typographyVariants({ level: 'h3' }), className)} {...props} />
  ),
)
TypographyH3.displayName = 'TypographyH3'

const TypographyH4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} data-slot="typography-h4" className={cn(typographyVariants({ level: 'h4' }), className)} {...props} />
  ),
)
TypographyH4.displayName = 'TypographyH4'

const TypographyP = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} data-slot="typography-p" className={cn(typographyVariants({ level: 'p' }), className)} {...props} />
  ),
)
TypographyP.displayName = 'TypographyP'

const TypographyBlockquote = React.forwardRef<HTMLQuoteElement, React.HTMLAttributes<HTMLQuoteElement>>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      data-slot="typography-blockquote"
      className={cn(typographyVariants({ level: 'blockquote' }), className)}
      {...props}
    />
  ),
)
TypographyBlockquote.displayName = 'TypographyBlockquote'

const TypographyList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-slot="typography-list"
      className={cn(typographyVariants({ level: 'list' }), className)}
      {...props}
    />
  ),
)
TypographyList.displayName = 'TypographyList'

const TypographyInlineCode = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      data-slot="typography-inline-code"
      className={cn(typographyVariants({ level: 'inlineCode' }), className)}
      {...props}
    />
  ),
)
TypographyInlineCode.displayName = 'TypographyInlineCode'

const TypographyLead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="typography-lead"
      className={cn(typographyVariants({ level: 'lead' }), className)}
      {...props}
    />
  ),
)
TypographyLead.displayName = 'TypographyLead'

const TypographyLarge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="typography-large"
      className={cn(typographyVariants({ level: 'large' }), className)}
      {...props}
    />
  ),
)
TypographyLarge.displayName = 'TypographyLarge'

const TypographySmall = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <small
      ref={ref}
      data-slot="typography-small"
      className={cn(typographyVariants({ level: 'small' }), className)}
      {...props}
    />
  ),
)
TypographySmall.displayName = 'TypographySmall'

const TypographyMuted = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="typography-muted"
      className={cn(typographyVariants({ level: 'muted' }), className)}
      {...props}
    />
  ),
)
TypographyMuted.displayName = 'TypographyMuted'

const TypographyTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { wrapperClassName?: string }
>(({ className, wrapperClassName, children, ...props }, ref) => (
  <div className={cn(typographyVariants({ level: 'tableWrapper' }), wrapperClassName)}>
    <table
      ref={ref}
      data-slot="typography-table"
      className={cn(typographyVariants({ level: 'table' }), className)}
      {...props}>
      {children}
    </table>
  </div>
))
TypographyTable.displayName = 'TypographyTable'

const TypographyTr = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} data-slot="typography-tr" className={cn(typographyVariants({ level: 'tr' }), className)} {...props} />
  ),
)
TypographyTr.displayName = 'TypographyTr'

const TypographyTh = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} data-slot="typography-th" className={cn(typographyVariants({ level: 'th' }), className)} {...props} />
  ),
)
TypographyTh.displayName = 'TypographyTh'

const TypographyTd = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} data-slot="typography-td" className={cn(typographyVariants({ level: 'td' }), className)} {...props} />
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
