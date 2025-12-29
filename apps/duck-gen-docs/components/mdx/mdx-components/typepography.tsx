import { cn } from '@gentleduck/libs/cn'
import Link from 'next/link'
import React from 'react'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface AnchorProps extends React.HTMLAttributes<HTMLAnchorElement> {}
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function H1({ className, ...props }: HeadingProps) {
  return <h1 className={cn('font-heading mt-2 scroll-m-20 text-4xl font-bold', className)} {...props} />
}

export function H2({ className, ...props }: HeadingProps) {
  return (
    <h2
      className={cn(
        'font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    />
  )
}

export function H3({ className, ...props }: HeadingProps) {
  return (
    <h3 className={cn('font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props} />
  )
}

export function H4({ className, ...props }: HeadingProps) {
  return (
    <h4 className={cn('font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight', className)} {...props} />
  )
}

export function H5({ className, ...props }: HeadingProps) {
  return <h5 className={cn('mt-8 scroll-m-20 text-lg font-semibold tracking-tight', className)} {...props} />
}

export function H6({ className, ...props }: HeadingProps) {
  return <h6 className={cn('mt-8 scroll-m-20 text-base font-semibold tracking-tight', className)} {...props} />
}

export function A({ className, ...props }: AnchorProps) {
  return <a className={cn('font-medium underline underline-offset-4', className)} {...props} />
}

export function P({ className, ...props }: ParagraphProps) {
  return <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)} {...props} />
}

export function LinkBlock({ className, ...props }: React.ComponentProps<typeof Link>) {
  return <Link className={cn('font-medium underline underline-offset-4', className)} {...props} />
}
export function LinkedCard({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10',
        className,
      )}
      {...props}
    />
  )
}

export function Hr({ ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className="my-4 md:my-8" {...props} />
}
