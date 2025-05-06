import { cva } from '@gentleduck/variants'

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
  '',
  {
    variants: {
      side: {
        top: `
          max-w-full w-full
          border-t
          -translate-y-full starting:open:-translate-y-full open:translate-y-0
          inset-y-auto
          `,
        bottom: `
          max-w-full w-full
          border-b
          translate-y-full starting:open:translate-y-full open:translate-y-0  
          inset-y-auto
        `,
        left: `
          max-h-screen h-screen
          border-l 
          -translate-x-full starting:open:-translate-x-full open:translate-x-0
          end-auto
        `,
        right: `
          max-h-screen h-screen
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
  '',
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
