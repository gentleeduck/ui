import { cn } from '@duck/libs/cn'
import { FC } from 'react'

interface CodeProps extends React.HTMLAttributes<HTMLElement> {}

export const CodeBlock: FC<CodeProps> = ({ className, ...props }) => {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className,
      )}
      {...props}
    />
  )
}
