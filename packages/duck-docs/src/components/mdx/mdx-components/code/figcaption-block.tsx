import { getIconForLanguageExtension } from '@duck-docs/components/icons'
import { cn } from '@gentleduck/libs/cn'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'

export function FigcaptionBlock({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const language = children?.toString().split('.').pop() ?? 'terminal'

  const Icon = getIconForLanguageExtension(language)

  return (
    <>
      <figcaption {...props} className="rounded-lg p-2">
        <div
          className={cn(
            className,
            'flex items-center gap-2 font-mono text-muted-foreground text-sm ltr:pl-1.5 rtl:pr-1.5 [&_svg]:h-4 [&_svg]:w-4',
          )}>
          {Icon}
          {children}
        </div>
      </figcaption>
      <Separator />
    </>
  )
}
