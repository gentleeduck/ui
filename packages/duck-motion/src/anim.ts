import { cva } from '@gentleduck/variants'

export const AnimVariants = cva('', {
  defaultVariants: {
    accelerated: 'default',
    alive: 'default',
  },
  variants: {
    accelerated: {
      default: 'transform-gpu will-change-[opacity,transform,translate,blur] backdrop:will-change-[opacity,blur]',
    },
    alive: {
      default: 'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
    },
    pseudo: {
      animate:
        '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-[inherit] [&:before,&:after]:ease-[inherit] [&:before,&:after]:will-change-[inherit]',
      default: '',
    },
  },
})

export const AnimPopoverArrowVariants = cva(
  `overflow-visible after:border-background after:w-0 after:h-0 after:absolute after:[position-anchor:var(--position-anchor)] after:[po ition-area:inherit] 
`,
  {
    defaultVariants: {
      side: 'left',
    },
    variants: {
      side: {
        bottom: `
            after:border-x-8 after:border-x-transparent after:border-b-10 
            after:-top-2.5 after:left-[50%] after:-translate-x-[50%]
        `,
        left: `after:border-y-8 after:border-y-transparent after:border-l-10
            after:-right-2.5 after:top-[50%] after:-translate-y-[50%]`,
        right: `
after:border-y-8 after:border-y-transparent after:border-r-10
            after:-left-2.5 after:top-[50%] after:-translate-y-[50%]
after:bg-red-600
        `,
        top: `
            after:border-x-8 after:border-x-transparent after:border-t-10
            after:-bottom-2.5 
          `,
      },
    },
  },
)

export const checkersStylePattern = cva(
  `appearance-none relative p-2 size-[1em] flex items-center rounded-full m-0
  border bg-border border-border checked:bg-primary checked:border-primary text-primary-foreground
  ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50 
  after:absolute after:drop-shadow after:bg-current after:size-[1em] after:rounded-[inherit] after:block after:mask-type-alpha after:mask-contain 
  after:opacity-0 checked:after:opacity-100 `,
  {
    defaultVariants: {
      indicatorState: 'default',
      type: 'checkbox',
    },
    variants: {
      indicatorState: {
        both: 'after:mask-[var(--svg-off)] checked:after:mask-[var(--svg-on)]',
        checkedIndicatorReady: 'checked:after:mask-[var(--svg-on)]',
        default: '',
        indicatorReady: 'after:mask-[var(--svg-off)]',
      },
      type: {
        checkbox: `
          justify-center rounded p-2
          after:rounded-none after:text-base
          checked:after:translate-y-0 after:translate-y-1/3 text-xs
          
            `,
        radio: `
          justify-center p-2 after:text-[10px]
          after:scale-0 checked:after:scale-100 
          `,
        switch: `
          px-4 py-2 justify-end after:text-md
          px-4.5 py-2.5 
          checked:after:translate-x-full after:opacity-100
            `,
      },
    },
  },
)
