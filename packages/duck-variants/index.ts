export * from './src'

import { cva } from './src'

export function generateResponsiveVariants(
  value = {
    sm: 'p-2 h-2 m-2',
    md: 'p-4 h-4 m-4',
    lg: 'p-6 h-6 m-6',
  },
) {
  return Object.entries(value)
    .map(([key, val]) =>
      val
        .split(' ')
        .map((v) => `${key}:${v}`)
        .join(' '),
    )
    .join(' ')
}

export const buttonVariants = cva('flex items-center', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
      destructive: 'bg-destructive/90 hover:bg-destructive/70  text-destructive-foreground shadow-xs',
      nothing: '',
    },
    size: {
      xs: 'h-6 px-2 py-1 text-xs [&_svg]:size-[1.3em] rounded-sm',
      sm: 'h-8 px-3 py-1.5 text-sm [&_svg]:size-[1.3em] rounded-md',
      default: 'h-9 px-4 py-2 text-base [&_svg]:size-[1.3em] rounded-md' + generateResponsiveVariants(),
    },
    border: {
      default: '',
      primary: 'border border-border/40 hover:border-border/80',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    border: 'default',
  },
})

console.log(buttonVariants())
