import { cn } from '@gentleduck/libs/cn'

export function SpanBlock({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return isLineComment(children?.toString()!) ? null : (
    <span className={cn(className)} {...props}>
      {children}
    </span>
  )
}
function isLineComment(str: string): boolean {
  // Matches strings starting with // followed by optional space and text
  return /^\/\/.*$/.test(str)
}
