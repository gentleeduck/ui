import { CopyButton } from '@duck-docs/components/copy-button'
import { cn } from '@gentleduck/libs/cn'
import { ShellCommand } from './shell-command'
import type { ICodeBlockProps } from './types'

export function PreBlock({
  className,
  __rawString__,
  __npmCommand__,
  __yarnCommand__,
  __pnpmCommand__,
  __bunCommand__,
  __withMeta__,
  __event__,
  children,
  ...props
}: ICodeBlockProps) {
  const theme = props['data-theme']

  return (
    <div data-theme={theme}>
      {__npmCommand__ && __yarnCommand__ && __pnpmCommand__ && __bunCommand__ ? (
        <ShellCommand
          __bunCommand__={__bunCommand__}
          __npmCommand__={__npmCommand__}
          __pnpmCommand__={__pnpmCommand__}
          __yarnCommand__={__yarnCommand__}
          {...props}
        />
      ) : (
        <>
          {__rawString__ && !__npmCommand__ && (
            <CopyButton
              className={cn(
                'absolute top-2 right-2 z-10 bg-muted [&_svg]:text-muted-foreground',
                __withMeta__ && 'top-16',
              )}
              event={__event__}
              value={__rawString__}
              variant={'outline'}
            />
          )}
          <pre
            className={cn(
              'max-h-162.5 overflow-auto rounded-lg py-4 focus-visible:shadow-none focus-visible:outline-none',
              className,
            )}
            {...props}>
            {children}
          </pre>
        </>
      )}
    </div>
  )
}
