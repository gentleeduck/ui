import { CopyButton } from '@duck-docs/components/copy-button'
import { cn } from '@gentleduck/libs/cn'
import { ShellCommand } from './shell-command'
import type { ICodeBlockProps } from './types'

// `@gentleduck/md` (the duck-md compiler, "dmc") emits `<pre>` two ways:
//   1. css-vars (default): a single `<pre>` carrying `--dmc-{mode}` vars
//      for every theme. No `data-theme`. Theme switching happens in CSS
//      via `var(--dmc-{active})`.
//   2. split: one `<pre data-theme="<mode>">` per theme. The
//      `data-theme` is preserved on the wrapper for theme-aware show/hide.
export function PreBlock({
  className,
  __dmcRaw__,
  npm,
  yarn,
  pnpm,
  bun,
  __dmcMeta__,
  __dmcEvent__,
  children,
  ...props
}: ICodeBlockProps) {
  const theme = props['data-theme']

  if (npm && yarn && pnpm && bun) {
    return <ShellCommand bun={bun} npm={npm} pnpm={pnpm} yarn={yarn} {...props} />
  }

  const inner = (
    <>
      {__dmcRaw__ && (
        <CopyButton
          className={cn('absolute top-2 right-2 z-10 bg-muted [&_svg]:text-muted-foreground', __dmcMeta__ && 'top-16')}
          event={__dmcEvent__}
          value={__dmcRaw__}
          variant="outline"
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
  )

  return theme ? <div data-theme={theme}>{inner}</div> : inner
}
