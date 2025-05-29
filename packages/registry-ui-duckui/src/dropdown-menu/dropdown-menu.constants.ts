import { cva } from '@gentleduck/variants'

export const dropdownMenuVariants = cva(
  [
    '[&[data-open="false"]]:opacity-0 [&[data-open="true"]]:opacity-100',
    'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  ].join(' '),
  {
    variants: {
      side: {
        top: [
          'bottom-full right-1/2 translate-x-1/2',
          'data-[open=false]:-translate-y-2',
          'data-[open=true]:translate-y-0',
          'mb-2',
        ].join(' '),
        bottom: [
          'top-full right-1/2 translate-x-1/2',
          'data-[open=false]:translate-y-2',
          'data-[open=true]:translate-y-0',
          'mt-2',
        ].join(' '),
        left: [
          'right-full top-1/2 -translate-y-1/2',
          'data-[open=false]:-translate-x-2',
          'data-[open=true]:translate-x-0',
          'mr-2',
        ].join(' '),
        right: [
          'left-full top-1/2 -translate-y-1/2',
          'data-[open=false]:translate-x-2',
          'data-[open=true]:translate-x-0',
          'ml-2',
        ].join(' '),
      },
    },
    defaultVariants: {
      side: 'top',
    },
  },
)
