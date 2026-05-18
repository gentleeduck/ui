import { cva } from '@gentleduck/variants'

export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md px-2 py-0.5 font-medium transition-colors [&_svg]-size-3 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none',
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
        icon: 'size-[1.6rem] items-center justify-center rounded-full p-0 [&_*]:size-[.9rem]',
        lg: 'px-3.5 py-0.9 text-lg',
        sm: 'px-1.5 py-0.5 text-[.7rem]',
      },
      variant: {
        nothing: '!px-0 text-accent-foreground',
        dashed:
          'border border-input border-dashed bg-background text-accent-foreground hover:bg-accent/50 hover:text-accent-foreground',
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
        outline: 'border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        warning: 'border-transparent bg-warning text-warning-foreground [a&]:hover:bg-warning/90',
      },
    },
  },
)
