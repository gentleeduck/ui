
import { cn } from '@gentelduck/libs/cn'

interface TextareaProps extends React.HTMLProps<HTMLTextAreaElement> { }

const Textarea = ({ className, ref, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

export { Textarea }
