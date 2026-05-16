import { cn } from '@gentleduck/libs/cn'

interface ICodeProps extends React.HTMLAttributes<HTMLElement> {
  __dmcRaw__?: boolean
  'data-language'?: string
}

export function CodeBlock({ className, __dmcRaw__, ...props }: ICodeProps) {
  // Fenced code: pretty-code emits `data-language` on <code> AND wraps
  // it in a <pre __dmcRaw__>. Either signal switches to block styling
  // (transparent bg, grid layout, no padding — the surrounding <pre>
  // owns the chrome). Bare inline <code> gets the chip style.
  const isFenced = __dmcRaw__ != null || props['data-language'] != null

  if (isFenced) {
    return (
      <code
        className={cn(
          // em-based size so a fenced block dropped under a heading
          // scales off the parent instead of locking to 14px.
          'relative grid min-w-full break-words rounded-none border-0 bg-transparent p-0 font-mono text-[0.875em]',
          className,
        )}
        {...props}
      />
    )
  }

  return (
    <code
      className={cn(
        // em-based so inline code inside `<h1>`/`<h2>`/… tracks the
        // heading size; default to the parent's `text-sm` equivalent
        // when rendered inside a paragraph.
        'relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.875em] dark:bg-muted',
        className,
      )}
      {...props}
    />
  )
}
