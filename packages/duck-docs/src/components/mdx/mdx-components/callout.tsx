import { cn } from '@gentleduck/libs/cn'
import { Alert, AlertDescription, AlertTitle } from '@gentleduck/registry-ui/alert'

type CalloutTone = 'default' | 'info' | 'warning' | 'deprecated'

const CALLOUT_TONE_CLASSES: Record<CalloutTone, string> = {
  default: '',
  info: 'border-sky-300/80 bg-gradient-to-br from-cyan-50 to-sky-50 text-sky-950 dark:border-sky-900 dark:from-cyan-950/35 dark:to-sky-950/30 dark:text-sky-100 [&_svg]:text-sky-600 dark:[&_svg]:text-sky-300',
  warning:
    'border-yellow-300/80 bg-gradient-to-br from-yellow-50 to-amber-50 text-yellow-950 dark:border-yellow-900 dark:from-yellow-950/35 dark:to-amber-950/30 dark:text-yellow-100 [&_svg]:text-yellow-600 dark:[&_svg]:text-yellow-300',
  deprecated:
    'border-rose-300/85 bg-gradient-to-br from-rose-50 to-pink-50 text-rose-950 dark:border-rose-900 dark:from-rose-950/40 dark:to-pink-950/30 dark:text-rose-100 [&_svg]:text-rose-600 dark:[&_svg]:text-rose-300',
}

export function Callout({
  title,
  children,
  icon,
  tone,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Alert> & {
  icon?: React.ReactNode
  tone?: CalloutTone
}) {
  return (
    <Alert
      className={cn(
        'my-6',
        icon && 'grid-cols-[calc(var(--spacing)*4)_1fr] gap-x-3',
        CALLOUT_TONE_CLASSES[tone ?? 'default'],
        className,
      )}
      {...props}>
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
