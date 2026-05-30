import type { Variants } from '@gentleduck/variants'
import { cva } from '@gentleduck/variants'

/**
 * Consistent transition + GPU-accelerated pseudo-element easing/duration across components.
 *
 * `pseudo: 'animate'` lets `:before`/`:after` inherit the host's transition duration and
 * easing. It intentionally does NOT set `will-change` — promoting a pseudo-element to a
 * GPU layer eagerly wastes memory on elements that may never animate. Let the browser
 * decide via `transition-gpu`.
 */
export const AnimVariants = cva('', {
  defaultVariants: {
    alive: 'default',
    pseudo: 'default',
  },
  variants: {
    alive: {
      default: 'transition-all transition-discrete duration-[200ms,150ms] ease-(--gentleduck-motion-ease)',
    },
    pseudo: {
      animate:
        '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-[inherit] [&:before,&:after]:ease-[inherit]',
      default: '',
    },
  },
})

export type AnimVariantsProps = Variants.VariantProps<typeof AnimVariants>
