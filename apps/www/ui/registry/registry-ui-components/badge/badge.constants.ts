import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        nothing: 'text-accent-foreground border-transparent !px-0',
      },
      size: {
        default: 'px-2.5 py-0.5 text-sm',
        sm: 'px-1.5 py-0.5 text-[.7rem]',
        lg: 'px-3.5 py-0.9 text-lg',
        icon: 'size-[28px] text-sm rounded-full justify-center items-center [&_*]:size-[.9rem]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
