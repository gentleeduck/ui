import { cn } from '@gentleduck/libs/cn'

export function SpanBlock({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return isLineComment(children?.toString() ?? '') ? null : (
    <span className={cn(className)} {...props}>
      {children}
    </span>
  )
}
function isLineComment(str: string): boolean {
  return /^\/\/.*$/.test(str)
}
