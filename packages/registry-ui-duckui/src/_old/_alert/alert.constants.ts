import { cva } from 'class-variance-authority'

export const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'bg-destructive/20 text-destructive-foreground border border-destructive/30 er-destructive/80 [&>div:last-child]:text-red-500 [&>svg]:stroke-red-500',
      },
    },
  },
)
