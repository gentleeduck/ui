import { cva } from '@gentleduck/variants'

export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 font-medium transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    defaultVariants: {
      border: 'default',
      size: 'default',
      variant: 'default',
    },
    variants: {
      border: {
        default: '',
        destructive: 'border border-destructive/40 bg-destructive/40 hover:border-destructive hover:bg-destructive/65',
        primary: 'border border-border/40 hover:border-border/80',
        secondary: 'border border-secondary/40 bg-secondary/40 hover:border-secondary hover:bg-secondary/65',
        warning: 'border border-warning/40 bg-warning/40 hover:border-warning hover:bg-warning/65',
      },
      size: {
        default: 'px-2.5 py-0.5 text-sm',
        icon: 'size-[28px] items-center justify-center rounded-full text-sm [&_*]:size-[.9rem]',
        lg: 'px-3.5 py-0.9 text-lg',
        sm: 'px-1.5 py-0.5 text-[.7rem]',
      },
      variant: {
        dashed:
          'border border-input border-dashed bg-background text-accent-foreground hover:bg-accent/50 hover:text-accent-foreground',
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        destructive: 'bg-destructive/90 text-destructive-foreground hover:bg-destructive/70',
        nothing: '!px-0 text-accent-foreground',
        outline:
          'border border-input bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        warning: 'bg-warning/90 text-warning-foreground hover:bg-warning/70',
      },
    },
  },
)
