import { cn } from '@gentleduck/libs/cn'
import { FC } from 'react'

interface CodeProps extends React.HTMLAttributes<HTMLElement> {}

export const Code: FC<CodeProps> = ({ className, ...props }) => {
  const rawString = (props as any)?.['__rawString__'] as string
  if (rawString) {
    return (
      <code
        className={cn(
          'relative rounded-sm bg-muted dark:bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
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
