/**
 * Maps each variant key to a selected value or array of values.
 *
 * @template TVariants - A mapping of variant names to their possible class mappings.
 * @example
 * ```ts
 * type ButtonVariants = {
 *   size: { sm: string; lg: string },
 *   intent: { primary: string; danger: string }
 * }
 *
 * // Accepts either a single key or an array of keys for each variant
 * const params: VariantParams<ButtonVariants> = {
 *   size: ['sm', 'lg'],
 *   intent: 'primary'
 * }
 * ```
 */
export type VariantParams<TVariants extends Record<string, Record<string, string | string[]>>> = {
  [K in keyof TVariants]?: keyof TVariants[K] | Array<keyof TVariants[K]>
}

/**
 * Configuration for creating a CVA (Class Variance Authority) function.
 *
 * @template TVariants - A mapping of variant names to their class mappings.
 *
 * @property {TVariants} variants
 *   The core variant definitions. Each variant key maps to an object whose keys
 *   are variant names and values are class strings or arrays of class strings.
 *
 * @property {VariantParams<TVariants>} [defaultVariants]
 *   Default selections applied when the user does not supply a value for a variant.
 *
 * @property {Array<VariantParams<TVariants> & { class?: ClassValue; className?: ClassValue }>} [compoundVariants]
 *   Array of objects that specify additional `class` or `className` entries when
 *   multiple variant keys match simultaneously. Each object’s own keys correspond
 *   to variant names (or arrays of variant names) indicating the match conditions.
 *
 * @example
 * ```ts
 * const options: VariantsOptions<{
 *   size: { sm: string; lg: string },
 *   tone: { muted: string; loud: string }
 * }> = {
 *   variants: {
 *     size: { sm: 'text-sm', lg: 'text-lg' },
 *     tone: { muted: 'opacity-50', loud: 'opacity-100' }
 *   },
 *   defaultVariants: { size: 'sm', tone: 'muted' },
 *   compoundVariants: [
 *     {
 *       size: 'lg',
 *       tone: ['loud', 'muted'],
 *       className: 'font-bold'
 *     }
 *   ]
 * }
 * ```
 */
export interface VariantsOptions<TVariants extends Record<string, Record<string, string | string[]>>> {
  variants: TVariants
  defaultVariants?: VariantParams<TVariants>
  compoundVariants?: Array<
    VariantParams<TVariants> & {
      class?: ClassValue
      className?: ClassValue
    }
  >
}

/**
 * Props accepted by a CVA-generated function: variant selections
 * plus optional `class` or `className` to append custom classes.
 *
 * @template TVariants - A mapping of variant names to their class mappings.
 *
 * @example
 * ```ts
 * const props: CvaProps<{
 *   color: { red: string; blue: string },
 *   size: { sm: string; lg: string }
 * }> = {
 *   color: 'blue',
 *   size: 'lg',
 *   className: ['my-custom-class', { 'is-active': true }]
 * }
 * ```
 */
export type CvaProps<TVariants extends Record<string, Record<string, string | string[]>>> = VariantParams<TVariants> & {
  className?: ClassValue
  class?: ClassValue
}

/**
 * Extracts only the variant-related props from a CVA function’s signature,
 * omitting `class` and `className`.
 *
 * @template T - A function type returned by `cva(...)`.
 *
 * @example
 * ```ts
 * declare const button: (props?: {
 *   size?: 'sm' | 'lg',
 *   intent?: 'primary' | 'danger',
 *   className?: string
 * }) => string;
 *
 * type ButtonVariantOnly = VariantProps<typeof button>
 * // => { size: 'sm' | 'lg'; intent: 'primary' | 'danger' }
 * ```
 */
export type VariantProps<T> = T extends (props?: infer P) => string
  ? {
      [K in keyof P as K extends 'class' | 'className' ? never : K]: P[K]
    }
  : never

/**
 * A dictionary mapping CSS class names to boolean flags.
 * Useful for conditional inclusion: `{ 'text-bold': isActive }`.
 */
export type ClassDictionary = Record<string, boolean | undefined>

/** An array of class values (nested arrays, strings, dictionaries). */
export type ClassArray = ClassValue[]

/**
 * Permitted inputs for class names:
 * - `string` or `number` (split on whitespace)
 * - `boolean` (included if `true`)
 * - `ClassDictionary` for conditional keys
 * - `ClassArray` for nested lists
 *
 * @example
 * ```ts
 * const input: ClassValue = [
 *   'px-4',
 *   { 'bg-red-500': isError },
 *   ['hover:bg-red-600', ['active:scale-95']]
 * ]
 * ```
 */
export type ClassValue = string | number | boolean | ClassDictionary | ClassArray
