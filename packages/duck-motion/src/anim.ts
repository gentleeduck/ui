import { cva } from '@gentleduck/variants'

export const AnimVariants = cva('', {
  variants: {
    alive: {
      default: 'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
    },
    pseudo: {
      animate:
        '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-[inherit] [&:before,&:after]:ease-[inherit] [&:before,&:after]:will-change-[inherit]',
      default: '',
    },
    accelerated: {
      default: 'transform-gpu will-change-[opacity,transform,translate,blur] backdrop:will-change-[opacity,blur]',
    },
  },
  defaultVariants: {
    alive: 'default',
    accelerated: 'default',
  },
})

export const AnimDialogVariants = cva(
  `relative z-50 h-fit w-full border border-border bg-background rounded-lg shadow-sm outline-hidden p-6 flex flex-col gap-4 overflow-hidden`,
  {
    variants: {
      animation: {
        default:
          'pointer-events-none opacity-0 starting:[&[data-open=true]:opacity-0] data-[open=true]:pointer-events-auto data-[open=true]:scale-100 data-[open=true]:opacity-100',
        nothing: '',
      },
    },
    defaultVariants: {
      animation: 'default',
    },
  },
)

export const AnimPopoverArrowVariants = cva(
  `overflow-visible after:border-background after:w-0 after:h-0 after:absolute after:[position-anchor:var(--position-anchor)] after:[po ition-area:inherit] 
`,
  {
    variants: {
      side: {
        top: `
            after:border-x-8 after:border-x-transparent after:border-t-10
            after:-bottom-2.5 
          `,
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
      },
    },
    defaultVariants: {
      side: 'left',
    },
  },
)

export const AnimSheetVariants = cva(
  '!fixed pointer-events-all relative z-50 flex flex-col gap-4 overflow-hidden bg-background p-6 outline-hidden transition ease-in-out data-[open=false]:animate-out data-[open=true]:animate-in',
  {
    variants: {
      side: {
        left: 'data-[open=false]:slide-out-to-left data-[open=true]:slide-in-from-left inset-y-0 left-0 h-full h-screen max-h-screen w-3/4 w-fit border-r border-r data-[open=false]:duration-400 data-[open=true]:duration-300 sm:max-w-sm',

        right:
          'data-[open=false]:slide-out-to-right data-[open=true]:slide-in-from-right inset-y-0 right-0 h-full h-screen max-h-screen w-3/4 w-fit border-l border-l data-[open=false]:duration-400 data-[open=true]:duration-500 sm:max-w-sm',

        top: 'data-[open=false]:slide-out-to-top data-[open=true]:slide-in-from-top inset-x-0 top-0 h-3/4 h-fit max-h-screen w-full border-b border-b data-[open=false]:duration-400 data-[open=true]:duration-300 sm:max-h-sm',

        bottom:
          'data-[open=false]:slide-out-to-bottom data-[open=true]:slide-in-from-bottom inset-x-0 bottom-0 h-3/4 h-fit max-h-screen w-full border-t border-t data-[open=false]:duration-400 data-[open=true]:duration-800 sm:max-h-sm',
      },
    },
    defaultVariants: {
      side: 'right',
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
    variants: {
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
      indicatorState: {
        default: '',
        indicatorReady: 'after:mask-[var(--svg-off)]',
        checkedIndicatorReady: 'checked:after:mask-[var(--svg-on)]',
        both: 'after:mask-[var(--svg-off)] checked:after:mask-[var(--svg-on)]',
      },
    },
    defaultVariants: {
      type: 'checkbox',
      indicatorState: 'default',
    },
  },
)
