/**
 * Represents the props for variants in the `cva` utility.
 *
 * This type allows you to define which variant values are available for each variant key in `TVariants`.
 * Each variant key can have an associated value from `TVariants[K]`, where `K` is the variant name.
 *
 * @template TVariants - The variants structure where each variant key has possible values and associated class names.
 */
export type VariantProps<
  TVariants extends Record<string, Record<string, string | Array<string>>>,
> = {
  // Each key is a variant name, and its value can be any of the values associated with that variant in `TVariants`
  [K in keyof TVariants]?: keyof TVariants[K]
}

/**
 * Configuration options for the `cva` function.
 *
 * This interface defines how variants should be structured, what default variants are available,
 * and how to handle compound variants (variant combinations).
 *
 * @template TVariants - The variants structure where each variant has possible values with corresponding class names.
 */
export interface VariantsOptions<
  TVariants extends Record<string, Record<string, string | Array<string>>>,
> {
  /**
   * A mapping of variant names (e.g., `size`, `color`) to their possible values
   * (e.g., `small`, `medium`, `large`) and associated class names for each value.
   */
  variants: TVariants

  /**
   * Optional default values to apply when no explicit value is provided for a variant.
   * If no default is provided, the variant will remain unresolved.
   */
  defaultVariants?: VariantProps<TVariants>

  /**
   * An array of compound variants, which specify additional classes to apply based on specific combinations of variants.
   * Each compound variant can be specified as a set of conditions (key-value pairs) and an associated `class` or `className`.
   */
  compoundVariants: Array<
    VariantProps<TVariants> & {
      /** Optional class or array of classes to be applied if conditions in `VariantProps<TVariants>` match. */
      class?: string | Array<string>
      /** Optional className or array of class names to be applied if conditions in `VariantProps<TVariants>` match. */
      className?: string | Array<string>
    }
  >
}

/**
 * Represents the props passed to the `cva` function.
 *
 * This type extends `VariantProps` to allow variant values to be passed as props.
 * It also allows users to pass additional `className` or `class` to apply custom styles.
 *
 * @template TVariants - The variants structure, where each key corresponds to a variant name and values to variant options.
 */
export type CvaProps<
  TVariants extends Record<string, Record<string, string | Array<string>>>,
> = VariantProps<TVariants> & {
  /** Additional class name(s) to apply. Supports a string or an array of strings. */
  className?: string | Array<string>

  /** Alternative way to pass a custom class. Supports a string or an array of strings. */
  class?: string | Array<string>
}
