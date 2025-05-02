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
  'max-h-screen h-screen border border-border m-0 bg-background p-6 inset-unset shadow-sm duration-400',
  {
    variants: {
      side: {
        top: `
          w-3/4 sm:max-w-sm
          border-t
          -translate-y-full starting:open:-translate-y-full open:translate-y-0
          inset-y-auto
          `,
        bottom: `
          w-3/4 sm:max-w-sm
          border-b
          translate-y-full starting:open:translate-y-full open:translate-y-0  
          inset-y-auto
        `,
        left: `
          border-l 
          -translate-x-full starting:open:-translate-x-full open:translate-x-0
          end-auto
        `,
        right: `
          border-r 
          translate-x-full starting:open:translate-x-full open:translate-x-0
          start-auto
        `,
      },
    },
    defaultVariants: {
      side: 'left',
    },
  }
)

export const AnimDrawerVariants = cva(
  'border border-border w-full max-w-full m-safe-10 rounded-lg bg-background p-6 inset-unset shadow-sm duration-650 ease-(--duck-motion-spring)',
  {
    variants: {
      side: {
        bottom: `
          border-b
          -translate-y-full starting:open:-translate-y-full open:translate-y-0  
          bottom-auto
        `,
        top: `
          border-t
          translate-y-full starting:open:translate-y-full open:translate-y-0
          top-auto
          `,
        left: `
          border-l 
          -translate-x-full starting:open:-translate-x-full open:translate-x-0
          end-auto
        `,
        right: `
          border-r 
          translate-x-full starting:open:translate-x-full open:translate-x-0
          start-auto
        `,
      },
    },
    defaultVariants: {
      side: 'bottom',
    },
  }
)
