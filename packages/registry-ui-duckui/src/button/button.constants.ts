import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 font-regular cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow',
        destructive:
          'bg-destructive/90 hover:bg-destructive/70  text-destructive-foreground shadow-sm',
        warning:
          'bg-warning/90 hover:bg-warning/70 text-warning-foreground shadow-sm',
        outline:
          'border border-input text-accent-foreground bg-background hover:bg-accent hover:text-accent-foreground shadow-sm',
        dashed:
          'border border-dashed border-input text-accent-foreground bg-background hover:bg-accent/50 hover:text-accent-foreground shadow-sm',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
        ghost:
          'hover:bg-accent text-accent-foreground hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        expand_icon:
          'group relative text-primary-foreground bg-primary hover:bg-primary/90',
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
        icon: 'text-base size-[2em] p-0 [&_svg]:size-[1.1em] rounded-md',
        xs: 'text-xs h-[2.5em] px-[1em] py-[0.5em] [&_svg]:size-[1.3em] rounded-md',
        sm: 'text-sm h-[2.5em] px-[1em] py-[0.5em] [&_svg]:size-[1.3em] rounded-md',
        default:
          'text-base h-[2.5em] px-[1.25em] py-[0.5em] [&_svg]:size-[1.3em] rounded-md',
        md: 'text-base h-[2.5em] px-[1.25em] py-[0.5em] [&_svg]:size-[1.3em] rounded-md',
        lg: 'text-lg h-[2.75em] px-[1.5em] py-[0.5em] [&_svg]:size-[1.3em] rounded-lg',
        xl: 'text-xl h-[3em] px-[1.75em] py-[0.5em] [&_svg]:size-[1.3em] rounded-lg',
        '2xl':
          'text-2xl h-[3.25em] px-[2em] py-[0.5em] [&_svg]:size-[1.3em] rounded-lg',
        '3xl':
          'text-3xl h-[3.5em] px-[2.25em] py-[0.5em] [&_svg]:size-[1.3em] rounded-lg',
      },
      border: {
        default: '',
        primary: 'border border-border/40 hover:border-border/80',
        secondary:
          'border border-secondary/40 hover:border-secondary bg-secondary/40 hover:bg-secondary/65',
        destructive:
          'border border-destructive/40 hover:border-destructive bg-destructive/40 hover:bg-destructive/65',
        warning:
          'border border-warning/40 hover:border-warning bg-warning/40 hover:bg-warning/65',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      border: 'default',
    },
  },
)
