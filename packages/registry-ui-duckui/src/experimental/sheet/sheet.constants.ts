import { cva } from '@gentelduck/variants'

export const sheetVariants = cva(
  '',
  {
    variants: {
      side: {
        top: `
          inset-x-0 top-0 border-b
          open:translate-y-0
          -translate-y-full
        `,
        bottom: `
          inset-x-0 bottom-0 border-t
          open:translate-y-0
          translate-y-full
        `,
        left: `
          inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm
          open:translate-x-0
          -translate-x-full
        `,
        right: `
          inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm
          open:translate-x-0
          translate-x-full
        `,
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)
