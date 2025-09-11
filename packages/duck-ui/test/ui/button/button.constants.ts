import { cva } from '@gentleduck/variants'

export const buttonVariants = cva(
  'relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-regular ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive: 'bg-destructive/90 text-destructive-foreground shadow-xs hover:bg-destructive/70',
        warning: 'bg-warning/90 text-warning-foreground shadow-xs hover:bg-warning/70',
        outline:
          'border border-input bg-background text-accent-foreground shadow-xs hover:bg-accent hover:text-accent-foreground',
        dashed:
          'border border-input border-dashed bg-background text-accent-foreground shadow-xs hover:bg-accent/50 hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'text-accent-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        expand_icon: 'group relative bg-primary text-primary-foreground hover:bg-primary/90',
        nothing: '',
      },
      size: {
        icon: 'size-9 rounded-md p-0 text-base [&_svg]:size-[1.3em]',
        xs: 'h-6 rounded-sm px-2 py-1 text-xs [&_svg]:size-[1.3em]',
        sm: 'h-8 rounded-md px-3 py-1.5 text-sm [&_svg]:size-[1.3em]',
        default: 'h-9 rounded-md px-4 py-2 text-base [&_svg]:size-[1.3em]',
        lg: 'h-10 rounded-md px-6 py-2.5 text-lg [&_svg]:size-[1.3em]',
        xl: 'h-12 rounded-lg px-8 py-3 text-xl [&_svg]:size-[1.3em]',
        '2xl': 'h-14 rounded-lg px-10 py-3.5 text-2xl [&_svg]:size-[1.3em]',
        '3xl': 'h-16 rounded-lg px-12 py-4 text-3xl [&_svg]:size-[1.3em]',
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
