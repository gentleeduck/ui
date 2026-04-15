import type { Variants } from './variants.types'

export { cva } from './variants'
export type { Variants } from './variants.types'

/**
 * Convenience re-export of {@link Variants.VariantProps} — extracts the
 * variant-only props from a CVA-generated function.
 */
export type VariantProps<T> = Variants.VariantProps<T>
