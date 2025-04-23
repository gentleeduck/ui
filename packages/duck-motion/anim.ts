import { cva } from 'class-variance-authority';


export const AnimVariants = cva('',
  {
    variants: {
      motionBlur: {
        default: "blur-1 open:blur-0 starting:open:blur-1",
      },
      motionBackdrop: {
        default: 'backdrop:transition-[inherit] backdrop:bg-black/0 starting:open:backdrop:bg-black/0 open:backdrop:bg-black/25',
      },
      motionAlive: {
        default: 'transition-all transition-discrete ease-(--duck-motion-ease) duration-(--duck-motion-dur)',
      },
      variant: {
        default: 'scale-90 opacity-0 starting:open:scale-90 starting:open:opacity-0 open:scale-100 open:opacity-100',
        fadeScaleIn: 'scale-75 opacity-0 starting:open:scale-75 starting:open:opacity-0 open:scale-100 open:opacity-100'
      },
    },
    defaultVariants: {
      motionAlive: 'default',
      motionBlur: 'default',
      motionBackdrop: 'default',
      variant: 'default',
    },
  },
)
