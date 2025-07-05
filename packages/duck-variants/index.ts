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
      default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
      destructive: 'bg-destructive/90 text-destructive-foreground shadow-xs hover:bg-destructive/70',
      nothing: '',
    },
    size: {
      xs: 'h-6 rounded-sm px-2 py-1 text-xs [&_svg]:size-[1.3em]',
      sm: 'h-8 rounded-md px-3 py-1.5 text-sm [&_svg]:size-[1.3em]',
      default: 'h-9 rounded-md px-4 py-2 text-base [&_svg]:size-[1.3em]' + generateResponsiveVariants(),
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
