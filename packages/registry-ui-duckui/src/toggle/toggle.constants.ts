import { cva } from '@gentleduck/variants'

export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has(input:checked)]:bg-accent [&:has(input:checked)]:text-accent-foreground [&:has(input:disabled)]:pointer-events-none [&:has(input:disabled)]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        lg: 'h-10 min-w-11 px-5 px-6 has-[>svg]:px-4',
        sm: 'h-8 min-w-9 gap-1.5 px-2.5 px-3 has-[>svg]:px-2.5',
      },
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
    },
  },
)
