import { cva } from '@gentleduck/variants'

export const AnimSheetVariants = cva(
  'pointer-events-all relative z-50 flex flex-col gap-4 overflow-hidden bg-background p-6 shadow-lg outline-hidden transition ease-in-out data-[open=false]:animate-out data-[open=true]:animate-in data-[open=false]:duration-400 data-[open=true]:duration-500',

  {
    defaultVariants: {
      side: 'right',
    },
    variants: {
      side: {
        bottom:
          'data-[open=false]:slide-out-to-bottom data-[open=true]:slide-in-from-bottom inset-x-0 bottom-0 h-3/4 h-fit max-h-screen w-full border-t sm:max-h-sm',
        left: 'data-[open=false]:slide-out-to-left data-[open=true]:slide-in-from-left inset-y-0 left-0 h-screen max-h-screen w-3/4 w-fit border-r sm:max-w-sm',

        right:
          'data-[open=false]:slide-out-to-right data-[open=true]:slide-in-from-right inset-y-0 right-0 h-screen max-h-screen w-3/4 w-fit border-l sm:max-w-sm',

        top: 'data-[open=false]:slide-out-to-top data-[open=true]:slide-in-from-top inset-x-0 top-0 h-3/4 h-fit max-h-screen w-full border-b sm:max-h-sm',
      },
    },
  },
)
