import { cva } from '@gentleduck/variants'

export const badgeVariants = cva(
  'inline-flex items-center rounded-md text-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive/90 text-destructive-foreground hover:bg-destructive/70',
        warning: 'bg-warning/90 text-warning-foreground hover:bg-warning/70',
        dashed:
          'border border-input border-dashed bg-background text-accent-foreground hover:bg-accent/50 hover:text-accent-foreground',
        outline:
          'border border-input bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground',
        nothing: '!px-0 text-accent-foreground',
      },
      size: {
        default: 'px-2.5 py-0.5 text-sm',
        sm: 'px-1.5 py-0.5 text-[.7rem]',
        lg: 'px-3.5 py-0.9 text-lg',
        icon: 'size-[28px] items-center justify-center rounded-full text-sm [&_*]:size-[.9rem]',
      },
      border: {
        default: '',
        primary: 'border border-border/40 hover:border-border/80',
        secondary: 'border border-secondary/40 bg-secondary/40 hover:border-secondary hover:bg-secondary/65',
        destructive: 'border border-destructive/40 bg-destructive/40 hover:border-destructive hover:bg-destructive/65',
        warning: 'border border-warning/40 bg-warning/40 hover:border-warning hover:bg-warning/65',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      border: 'default',
    },
  },
)
