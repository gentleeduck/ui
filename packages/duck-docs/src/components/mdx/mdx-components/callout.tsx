import { cn } from '@gentleduck/libs/cn'
import { Alert, AlertDescription, AlertTitle } from '@gentleduck/registry-ui-duckui/alert'

interface CalloutProps {
  icon?: React.ReactNode
  title?: string
  children?: React.ReactNode
  className?: string
  [key: string]: unknown
}

export function Callout({ title, children, icon, className, ...props }: CalloutProps) {
  return (
    <Alert className={cn('my-6', icon && 'grid-cols-[calc(var(--spacing)*4)_1fr] gap-x-3', className)}>
      {icon && (
        <span className="row-span-2 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:translate-y-0.5 [&_svg]:text-current">
          {icon}
        </span>
      )}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
