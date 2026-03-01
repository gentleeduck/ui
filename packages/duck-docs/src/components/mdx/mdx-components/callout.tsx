import { cn } from '@gentleduck/libs/cn'
import { Alert, AlertDescription, AlertTitle } from '@gentleduck/registry-ui/alert'

export function Callout({
  title,
  children,
  icon,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Alert> & {
  icon?: React.ReactNode
}) {
  return (
    <Alert className={cn('my-6', icon && 'grid-cols-[calc(var(--spacing)*4)_1fr] gap-x-3', className)} {...props}>
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
