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
          'relative grid min-w-full break-words rounded-none border-0 bg-transparent p-0 font-mono text-sm',
          className,
        )}
        {...props}
      />
    )
  }

  return (
    <code
      className={cn('relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm dark:bg-muted', className)}
      {...props}
    />
  )
}
