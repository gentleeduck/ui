import { cva } from '@gentleduck/variants'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive/90 hover:bg-destructive/70  text-destructive-foreground',
        warning: 'bg-warning/90 hover:bg-warning/70 text-warning-foreground',
        dashed:
          'border border-dashed border-input text-accent-foreground bg-background hover:bg-accent/50 hover:text-accent-foreground',
        outline:
          'border border-input text-accent-foreground bg-background hover:bg-accent hover:text-accent-foreground',
        nothing: 'text-accent-foreground !px-0',
      },
      size: {
        default: 'px-2.5 py-0.5 text-sm',
        sm: 'px-1.5 py-0.5 text-[.7rem]',
        lg: 'px-3.5 py-0.9 text-lg',
        icon: 'size-[28px] text-sm rounded-full justify-center items-center [&_*]:size-[.9rem]',
      },
      border: {
        default: '',
        primary: 'border border-border/40 hover:border-border/80',
        secondary: 'border border-secondary/40 hover:border-secondary bg-secondary/40 hover:bg-secondary/65',
        destructive: 'border border-destructive/40 hover:border-destructive bg-destructive/40 hover:bg-destructive/65',
        warning: 'border border-warning/40 hover:border-warning bg-warning/40 hover:bg-warning/65',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      border: 'default',
    },
  },
)
