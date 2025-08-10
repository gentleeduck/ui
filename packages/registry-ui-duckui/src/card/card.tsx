import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

function Card({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div ref={ref} className={cn('rounded-lg border bg-card text-card-foreground shadow-xs', className)} {...props} />
  )
}

function CardHeader({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

function CardTitle({ className, ref, ...props }: React.HTMLProps<HTMLHeadingElement>) {
  return <h3 ref={ref} className={cn('font-semibold text-2xl leading-none tracking-tight', className)} {...props} />
}

function CardDescription({ className, ref, ...props }: React.HTMLProps<HTMLParagraphElement>) {
  return <p ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
}

function CardContent({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
}

function CardFooter({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
