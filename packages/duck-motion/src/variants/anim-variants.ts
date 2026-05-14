import type { Variants } from '@gentleduck/variants'
import { cva } from '@gentleduck/variants'

/** Consistent transition + GPU-accelerated pseudo-element easing/duration across components. */
export const AnimVariants = cva('', {
  defaultVariants: {
    alive: 'default',
  },
  variants: {
    alive: {
      default: 'transition-all transition-discrete duration-[200ms,150ms] ease-(--gentleduck-motion-ease)',
    },
    pseudo: {
      animate:
        '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-[inherit] [&:before,&:after]:ease-[inherit] [&:before,&:after]:will-change-[inherit]',
      default: '',
    },
  },
})

export type AnimVariantsProps = Variants.VariantProps<typeof AnimVariants>
