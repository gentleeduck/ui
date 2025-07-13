import { cva } from '@gentleduck/variants'

export const buttonVariants = cva(
  'relative flex inline-flex h-full w-full cursor-pointer items-center items-center justify-center justify-center gap-2 whitespace-nowrap font-regular ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
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
        ring_hover:
          'bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2',
        shine:
          'animate-shine bg-[length:400%_100%] bg-gradient-to-r from-primary via-primary/75 to-primary text-primary-foreground ',
        gooey_right:
          'before:-z-10 relative z-0 overflow-hidden bg-primary from-zinc-400 text-primary-foreground transition-all duration-500 before:absolute before:inset-0 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r before:transition-transform before:duration-1000 hover:before:translate-x-[0%] hover:before:translate-y-[0%] ',
        gooey_left:
          'after:-z-10 relative z-0 overflow-hidden bg-primary from-zinc-400 text-primary-foreground transition-all duration-500 after:absolute after:inset-0 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l after:transition-transform after:duration-1000 hover:after:translate-x-[0%] hover:after:translate-y-[0%] ',
        link_hover1:
          'relative after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0',
        link_hover2:
          'relative after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100',
        nothing: '',
      },
      size: {
        icon: 'size-9 rounded-md p-0 text-base [&_svg]:size-[1.1em]',
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
