import { cn } from '@gentleduck/libs/cn'

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  __rawString__?: boolean
}

export function CodeBlock({ className, __rawString__, ...props }: CodeProps) {
  if (__rawString__) {
    return (
      <code
        className={cn(
          'relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm dark:bg-muted',
          className,
        )}
        {...props}
      />
    )
  }

  return (
    <code
      className={cn(
        'relative rounded-sm px-[0.3rem] py-[0.2rem] font-mono text-sm',
        'grid min-w-full break-words rounded-none border-0 bg-transparent p-0',
        className,
      )}
      {...props}
    />
  )
}
