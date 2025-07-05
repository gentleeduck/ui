import { cva } from '@gentleduck/variants'

export const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'er-destructive/80 border border-destructive/30 bg-destructive/20 text-destructive-foreground [&>div:last-child]:text-red-500 [&>svg]:stroke-red-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
