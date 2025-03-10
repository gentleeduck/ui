import { cn } from '@duck/libs/cn'
import { FC } from 'react'

interface CodeProps extends React.HTMLAttributes<HTMLElement> {}

export const Code: FC<CodeProps> = ({ className, ...props }) => {
  return (
    <code
      className={cn(
        'relative rounded font-mono text-sm grid min-w-full break-words border-0',
        className,
      )}
      {...props}
    />
  )
}
