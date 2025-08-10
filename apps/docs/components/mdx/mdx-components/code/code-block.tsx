import { cn } from '@gentleduck/libs/cn'
import { FC } from 'react'

interface CodeProps extends React.HTMLAttributes<HTMLElement> {}

export const Code: FC<CodeProps> = ({ className, ...props }) => {
  return (
    <code
      className={cn('relative rounded-sm bg-muted dark:bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm', className)}
      {...props}
    />
  )
}
