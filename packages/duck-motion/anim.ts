import { cva } from '@gentelduck/variants'

export const AnimVariants = cva('', {
  variants: {
    motionBlur: {
      default: 'blur-1 open:blur-0 starting:open:blur-1',
    },
    motionBackdrop: {
      default:
        'backdrop:transition-[inherit] backdrop:bg-black/0 starting:open:backdrop:bg-black/0 open:backdrop:bg-black/25',
    },
    motionAlive: {
      default:
        'transition-all transition-discrete ease-(--duck-motion-ease) duration-(--duck-motion-dur)',
    },
    accelerated: {
      default: 'will-change-auto',
      transformGpu: 'transform-gpu',
    },
  },
  defaultVariants: {
    motionAlive: 'default',
    motionBlur: 'default',
    motionBackdrop: 'default',
    accelerated: 'default',
  },
})

export const AnimDialogVariants = cva('', {
  variants: {
    animation: {
      default:
        'scale-90 opacity-0 starting:open:scale-90 starting:open:opacity-0 open:scale-100 open:opacity-100',
      fadeScaleIn:
        'scale-75 opacity-0 starting:open:scale-75 starting:open:opacity-0 open:scale-100 open:opacity-100',
    },
  },
  defaultVariants: {
    animation: 'default',
  },
})

export const AnimSheetVariants = cva(
  'open:grid h-screen gap-4 border border-border bg-background p-6 shadow-sm duration-400',
  {
    variants: {
      side: {
        top: `
          w-3/4 sm:max-w-sm
          border-b
          translate-y-0 starting:open:translate-y-0 open:-translate-y-full  
          inset-y-0 top-0   
          `,
        bottom: `
          w-3/4 sm:max-w-sm
          border-t
          -translate-y-0 starting:open:-translate-y-0 open:-translate-y-full
          inset-y-0 bottom-0
        `,
        left: `
          border-l 
          -translate-x-0 starting:open:-translate-x-0 open:translate-x-full
          inset-x-0 left-0
        `,
        right: `
          border-r 
          translate-x-0 starting:open:translate-x-0 open:translate-x-full
          inset-x-0 right-0 
        `,
      },
    },
    defaultVariants: {
      side: 'left',
    },
  }
)
