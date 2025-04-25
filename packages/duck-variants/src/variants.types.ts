/**
 * `VariantParams` is a utility type that extracts the shape of accepted variant props
 * from a variant configuration object. Each key maps to a union of allowed string literals
 * representing the variant values.
 *
 * @template TVariants - A record of variant keys mapping to records of string values.
 *
 * @example
 * ```ts
 * const variants = {
 *   size: {
 *     sm: 'text-sm',
 *     lg: 'text-lg',
 *   },
 *   color: {
 *     primary: 'text-blue-500',
 *     secondary: 'text-gray-500',
 *   },
 * }
 *
 * type ButtonVariants = VariantParams<typeof variants>
 * // Result:
 * // {
 * //   size?: 'sm' | 'lg'
 * //   color?: 'primary' | 'secondary'
 * // }
 * ```
 */
export type VariantParams<
  TVariants extends Record<string, Record<string, string | Array<string>>>,
> = {
  [K in keyof TVariants]?: keyof TVariants[K]
}

/**
 * `VariantsOptions` defines the configuration object passed to the `cva` function.
 * It provides the structure for handling variant-based class composition.
 *
 * @template TVariants - A record of variant keys and their corresponding value maps.
 *
 * @property {TVariants} variants - The core variant mapping. Each variant key should point to a record of allowed values and their class names.
 * @property {VariantParams<TVariants>} [defaultVariants] - Optional default variant values that apply when not explicitly set.
 * @property {Array<CompoundVariant<TVariants>>} [compoundVariants] - Optional array of compound variant configurations that apply extra classes when a group of variant values match.
 *
 * @example
 * ```ts
 * const options: VariantsOptions<{
 *   size: { sm: string; lg: string }
 *   color: { primary: string; secondary: string }
 * }> = {
 *   variants: {
 *     size: { sm: 'text-sm', lg: 'text-lg' },
 *     color: { primary: 'text-blue-500', secondary: 'text-gray-500' },
 *   },
 *   defaultVariants: {
 *     size: 'sm',
 *     color: 'primary',
 *   },
 *   compoundVariants: [
 *     {
 *       size: 'sm',
 *       color: 'secondary',
 *       class: 'bg-light',
 *     },
 *   ],
 * }
 * ```
 */
export interface VariantsOptions<
  TVariants extends Record<string, Record<string, string | Array<string>>>,
> {
  variants: TVariants

  defaultVariants?: VariantParams<TVariants>

  compoundVariants?: Array<
    VariantParams<TVariants> & {
      /**
       * Extra class or class list to apply when this compound variant matches.
       */
      class?: string | Array<string>

      /**
       * Alternative to `class`, supports Tailwind conventions and merges properly.
       */
      className?: string | Array<string>
    }
  >
}

/**
 * `CvaProps` defines the shape of the function parameters accepted by the `cva` result.
 * It includes dynamic variant values, optional `className`, and `class` attributes.
 *
 * This enables seamless integration with frameworks like React or Vue,
 * where merging external `className`s is required.
 *
 * @template TVariants - A record of variant keys and their value-to-class mappings.
 *
 * @example
 * ```ts
 * const button = cva('base', {
 *   variants: {
 *     size: { sm: 'text-sm', lg: 'text-lg' },
 *   },
 *   defaultVariants: { size: 'sm' },
 * })
 *
 * const className = button({ size: 'lg', className: 'mt-4' })
 * // => 'base text-lg mt-4'
 * ```
 */
export type CvaProps<
  TVariants extends Record<string, Record<string, string | Array<string>>>,
> = VariantParams<TVariants> & {
  /**
   * Optional external class string or array to append to generated output.
   */
  className?: string | Array<string>

  /**
   * Optional alternative to `className`. Useful when working with native `class` attributes.
   */
  class?: string | Array<string>
}

/**
 * `VariantProps` is a utility type that extracts only the variant-related props
 * from a `cva`-generated function type, omitting `className` and `class`.
 *
 * This is useful when you want to create a fully type-safe variant signature for a UI component
 * without including styling props like `className`.
 *
 * @template T - A function returned by `cva()`.
 *
 * @example
 * ```ts
 * const badge = cva('badge', {
 *   variants: {
 *     type: { success: 'text-green', error: 'text-red' },
 *   },
 * })
 *
 * type BadgeVariants = VariantProps<typeof badge>
 * // Result:
 * // {
 * //   type: 'success' | 'error'
 * // }
 * ```
 */
export type VariantProps<T> = T extends (props?: infer Props) => any
  ? {
      [K in keyof Props as K extends 'class' | 'className'
        ? never
        : K]-?: Exclude<Props[K], undefined>
    }
  : never
