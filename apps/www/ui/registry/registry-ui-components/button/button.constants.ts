import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 font-regular',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive/30 hover:bg-destructive/55 text-destructive-foreground',
        warning: 'bg-warning/30 hover:bg-warning/55 text-warning-foreground',
        muted: 'bg-muted/30 hover:bg-muted/65 text-muted-foreground',
        outline:
          'border border-input text-accent-foreground bg-background hover:bg-accent hover:text-accent-foreground',
        dashed:
          'border border-dashed border-input text-accent-foreground bg-background hover:bg-accent/50 hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent text-accent-foreground hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        expand_icon: 'group relative text-primary-foreground bg-primary hover:bg-primary/90',
        ring_hover:
          'bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2',
        shine:
          'text-primary-foreground animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] ',
        gooey_right:
          'text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-zinc-400 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%] ',
        gooey_left:
          'text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-400 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ',
        link_hover1:
          'relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300',
        link_hover2:
          'relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300',
        nothing: '',
      },
      size: {
        icon: 'h-10 w-10 p-0 [&_svg]:h-[1.4rem] [&_svg]:w-[1.4rem]',
        xs: 'text-xs px-2.5 py-1 h-[1.625rem] [&_svg]:h-[0.875rem] [&_svg]:w-[0.875rem]',
        sm: `text-sm leading-4 px-3 py-2 h-[34px] [&_svg]:h-[1.125rem] [&_svg]:w-[1.125rem]`,
        default: `text-sm px-4 py-2 h-[2.5rem] [&_svg]:h-[1.25rem] [&_svg]:w-[1.25rem]`,
        lg: `text-md px-4 py-2 h-[2.8125rem] [&_svg]:h-[1.25rem] [&_svg]:w-[1.25rem]`,
        xl: `text-lg px-6 py-3 h-[3.125rem] [&_svg]:h-[1.5rem] [&_svg]:w-[1.5rem]`,
        xxl: `text-xl px-8 py-4 h-[3.625rem] [&_svg]:h-[1.625rem] [&_svg]:w-[1.625rem]`,
        xxxl: `text-2xl px-12 py-6 h-[4.375rem] [&_svg]:h-[1.875rem] [&_svg]:w-[1.875rem]`,
      },
      border: {
        default: '',
        primary: 'border border-border/40 hover:border-border/80',
        destructive: 'border border-destructive/30 hover:border-destructive/80',
        warning: 'border border-warning/30 hover:border-warning/80',
        muted: 'border border-muted/40 hover:border-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      border: 'default',
    },
  }
)
