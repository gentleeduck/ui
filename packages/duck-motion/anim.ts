import { cva } from '@gentleduck/variants'

export const AnimVariants = cva('', {
  variants: {
    motionBlur: {
      default: 
      // 'blur-xs starting:open:blur-xs open:blur-none',
      '',
    },
    motionBackdrop: {
      default:
        'backdrop:transition-[inherit] backdrop:duration-[inherit] backdrop:ease-[inherit] backdrop:bg-black/50  backdrop:opacity-0 starting:open:backdrop:opacity-0 open:backdrop:opacity-100',
    },
    motionAlive: {
      default: 'transition-all transition-discrete ease-(--duck-motion-ease) duration-[200ms,150ms]',
    },
    accelerated: {
      default: 'will-change-[opacity,transform,blur] backdrop:will-change-[opacity,blur] transform-gpu',
    },
  },
  defaultVariants: {
    motionAlive: 'default',
    motionBlur: 'default',
    motionBackdrop: 'default',
    accelerated: 'default',
  },
})

const ContentWrapper =
  '[&>.content-wrapper]:p-6 [&>.content-wrapper]:size-full [&>.content-wrapper]:gap-[inherit]'

export const AnimDialogVariants = cva(
  `open:grid inset-1/2 -translate-1/2 border border-border bg-background rounded-lg p-0 m-0 gap-4 w-full sm:max-w-lg shadow-sm ${ContentWrapper}`,
  {
    variants: {
      animation: {
        default: 'opacity-0 scale-90 starting:open:opacity-0 starting:open:scale-90 open:opacity-100 open:scale-100',
        fadeScaleIn:
          'opacity-0 scale-75 starting:open:opacity-0 starting:open:scale-75 open:opacity-100 open:scale-100 ',
      },
    },
    defaultVariants: {
      animation: 'default',
    },
  },
)

export const AnimSheetVariants = cva(`open:grid gap-4 duration-400  ${ContentWrapper}`, {
  variants: {
    side: {
      top: `
          max-w-full w-full
          border-b
          -translate-y-full starting:open:-translate-y-full open:translate-y-0  
          bottom-auto
          `,
      bottom: `
          max-w-full w-full
          border-t
          translate-y-full starting:open:translate-y-full open:translate-y-0
          top-auto
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
})
