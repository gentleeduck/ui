import { cn } from '@gentleduck/libs/cn'
import Link from 'next/link'
import type React from 'react'

interface IHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface IAnchorProps extends React.HTMLAttributes<HTMLAnchorElement> {}
interface IParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function H1({ className, ...props }: IHeadingProps) {
  return (
    <h1
      className={cn('mt-2 scroll-m-20 font-bold font-heading text-2xl sm:text-3xl md:text-4xl', className)}
      {...props}
    />
  )
}

export function H2({ className, ...props }: IHeadingProps) {
  return (
    <h2
      className={cn(
        'mt-12 scroll-m-20 border-b pb-2 font-heading font-semibold text-xl tracking-tight first:mt-0 sm:text-2xl',
        className,
      )}
      {...props}
    />
  )
}

export function H3({ className, ...props }: IHeadingProps) {
  return (
    <h3
      className={cn('mt-8 scroll-m-20 font-heading font-semibold text-lg tracking-tight sm:text-xl', className)}
      {...props}
    />
  )
}

export function H4({ className, ...props }: IHeadingProps) {
  return (
    <h4
      className={cn('mt-8 scroll-m-20 font-heading font-semibold text-base tracking-tight sm:text-lg', className)}
      {...props}
    />
  )
}

export function H5({ className, ...props }: IHeadingProps) {
  return (
    <h5 className={cn('mt-8 scroll-m-20 font-semibold text-base tracking-tight sm:text-lg', className)} {...props} />
  )
}

export function H6({ className, ...props }: IHeadingProps) {
  return <h6 className={cn('mt-8 scroll-m-20 font-semibold text-base tracking-tight', className)} {...props} />
}

export function A({ className, ...props }: IAnchorProps) {
  return <a className={cn('font-medium underline underline-offset-4', className)} {...props} />
}

export function P({ className, ...props }: IParagraphProps) {
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
