export namespace Variants {
  /**
   * Primitive values accepted by the class flattener.
   *
   * Boolean primitives are ignored, which makes expressions such as
   * `isActive && "active"` safe inside class arrays.
   */
  export type ClassPrimitive = string | number | bigint | boolean | null | undefined

  /**
   * A dictionary mapping CSS class names to truthy or falsy flags.
   * Useful for conditional inclusion: `{ "text-bold": isActive }`.
   */
  export type ClassDictionary = Readonly<Record<string, boolean | null | undefined>>

  /** An array of class values (nested arrays, strings, dictionaries). */
  export type ClassArray = ReadonlyArray<ClassValue>

  /**
   * Permitted inputs for class names:
   * - `string`, `number`, or `bigint` values, split on whitespace when needed
   * - `boolean`, `null`, and `undefined`, which are ignored
   * - {@link ClassDictionary} for conditional keys
   * - {@link ClassArray} for nested lists
   *
   * @example
   * ```ts
   * const input: Variants.ClassValue = [
   *   "px-4",
   *   { "bg-red-500": isError },
   *   ["hover:bg-red-600", ["active:scale-95"]],
   * ]
   * ```
   */
  export type ClassValue = ClassPrimitive | ClassDictionary | ClassArray

  /** The class payload stored for a single variant option. */
  export type VariantClassValue = ClassValue

  /** A map of variant option names to the classes they contribute. */
  export type VariantValueMap = Readonly<Record<string, VariantClassValue>>

  /** A map of variant names to their available option maps. */
  export type VariantDefinitions = Readonly<Record<string, VariantValueMap>>

  /**
   * Maps each variant key to a selected value or array of values.
   *
   * @template TVariants - A mapping of variant names to their possible class mappings.
   * @example
   * ```ts
   * type ButtonVariants = {
   *   size: { sm: string; lg: string }
   *   intent: { primary: string; danger: string }
   * }
   *
   * const params: Variants.VariantParams<ButtonVariants> = {
   *   size: ["sm", "lg"],
   *   intent: "primary",
   * }
   * ```
   */
  export type VariantParams<TVariants extends VariantDefinitions> = {
    readonly [K in keyof TVariants]?: keyof TVariants[K] | ReadonlyArray<keyof TVariants[K]> | null
  }

  /**
   * Options for creating a CVA function, without the `base` classes.
   *
   * @template TVariants - The variant definitions map.
   */
  export type Options<TVariants extends VariantDefinitions> = {
    readonly variants?: TVariants
    readonly defaultVariants?: VariantParams<TVariants>
    readonly compoundVariants?: ReadonlyArray<
      VariantParams<TVariants> & {
        readonly class?: ClassValue
        readonly className?: ClassValue
      }
    >
  }

  /**
   * Full configuration accepted by `cva()`: {@link Options} plus `base` classes.
   *
   * @template TVariants - The variant definitions map.
   */
  export type Config<TVariants extends VariantDefinitions> = Options<TVariants> & {
    readonly base?: ClassValue
  }

  /**
   * Props accepted by a CVA-generated function: variant selections
   * plus optional `class` or `className` to append custom classes.
   *
   * @template TVariants - The variant definitions map.
   */
  export type Props<TVariants extends VariantDefinitions> = VariantParams<TVariants> & {
    readonly className?: ClassValue
    readonly class?: ClassValue
  }

  /**
   * Extracts only the variant-related props from a CVA function signature,
   * omitting `class` and `className`.
   *
   * @template T - A CVA-generated function type.
   */
  export type VariantProps<T> = T extends (props?: infer P) => string
    ? Omit<NonNullable<P>, 'class' | 'className'>
    : never

  /**
   * Infers the `variants` field from an {@link Options} object.
   *
   * @template T - A CVA options object type.
   */
  export type Infer<T extends Options<VariantDefinitions>> = T['variants']
}
