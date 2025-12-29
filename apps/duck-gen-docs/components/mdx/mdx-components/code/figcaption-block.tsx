import { cn } from '@gentleduck/libs/cn'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { getIconForLanguageExtension } from '~/components/icons'

export function FigcaptionBlock({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const language = children?.toString().split('.').pop() ?? 'terminal'

  const Icon = getIconForLanguageExtension(language)

  return (
    <>
      <figcaption {...props} className="p-2 rounded-lg">
        <div
          className={cn(
            className,
            'flex items-center gap-2 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4 ltr:pl-1.5 rtl:pr-1.5 font-mono text-sm',
          )}>
          {Icon}
          {children}
        </div>
      </figcaption>
      <Separator />
    </>
  )
}
