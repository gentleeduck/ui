import { cva } from '@gentelduck/variants'

export const sheetVariants = cva(
  'fixed z-[51] gap-4 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none',
  {
    variants: {
      side: {
        top: `
          inset-x-0 top-0 border-b
          data-[state=open]:translate-y-0
          data-[state=closed]:-translate-y-full
        `,
        bottom: `
          inset-x-0 bottom-0 border-t
          data-[state=open]:translate-y-0
          data-[state=closed]:translate-y-full
        `,
        left: `
          inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm
          data-[state=open]:translate-x-0
          data-[state=closed]:-translate-x-full
        `,
        right: `
          inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm
          data-[state=open]:translate-x-0
          data-[state=closed]:translate-x-full
        `,
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)
