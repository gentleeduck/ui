/** @public Pass as variant prop value to skip the variant (opt out of a default explicitly). */
export const UNSET = 'unset' as const
export type Unset = typeof UNSET

export namespace Variants {
  /** Boolean/null/undefined are ignored so `isActive && "active"` is safe in class arrays. */
  export type ClassPrimitive = string | number | bigint | boolean | null | undefined

  /** Conditional class map: `{ "text-bold": isActive }`. */
  export type ClassDictionary = Readonly<Record<string, boolean | null | undefined>>

  export type ClassArray = ReadonlyArray<ClassValue>

  export type ClassValue = ClassPrimitive | ClassDictionary | ClassArray

  export type VariantValueMap = Readonly<Record<string, ClassValue>>

  export type VariantDefinitions = Readonly<Record<string, VariantValueMap>>

  /**
   * Scalar variant prop values. `null`/`undefined`/{@link UNSET} skip the variant (no default fallback).
   * Arrays are rejected — they only match {@link CompoundConditions}; runtime would stringify to `"a,b"` and silently miss.
   */
  export type VariantParams<TVariants extends VariantDefinitions> = {
    readonly [K in keyof TVariants]?: keyof TVariants[K] | Unset | null
  }

  /**
   * Conditions for matching a compound variant. Values may be a single variant
   * option OR a `ReadonlyArray` of options — `["sm", "lg"]` means "either".
   */
  export type CompoundConditions<TVariants extends VariantDefinitions> = {
    readonly [K in keyof TVariants]?: keyof TVariants[K] | ReadonlyArray<keyof TVariants[K]> | Unset | null
  }

  export type Options<TVariants extends VariantDefinitions> = {
    readonly variants?: TVariants
    readonly defaultVariants?: VariantParams<TVariants>
    readonly compoundVariants?: ReadonlyArray<
      CompoundConditions<TVariants> & {
        readonly class?: ClassValue
        readonly className?: ClassValue
      }
    >
  }

  export type Config<TVariants extends VariantDefinitions> = Options<TVariants> & {
    readonly base?: ClassValue
  }

  /** Keys with a default — used by `Props<T, D>` to make them optional vs required. */
  export type DefaultedKeys<
    TVariants extends VariantDefinitions,
    TDefaults extends VariantParams<TVariants> | undefined,
  > =
    TDefaults extends VariantParams<TVariants>
      ? { [K in keyof TDefaults]: TDefaults[K] extends undefined ? never : K }[keyof TDefaults]
      : never

  /** Scalar variant value (non-optional). */
  type VariantValue<TVariants extends VariantDefinitions, K extends keyof TVariants> = keyof TVariants[K] | Unset | null

  /**
   * Public props for a `cva` call. `TDefaults` makes defaulted keys optional + non-defaulted required.
   * No defaults → every key required. `class`/`className` both accepted; `className` wins ties.
   */
  export type Props<
    TVariants extends VariantDefinitions,
    TDefaults extends VariantParams<TVariants> | undefined = undefined,
  > = {
    readonly [K in Exclude<keyof TVariants, DefaultedKeys<TVariants, TDefaults>>]: VariantValue<TVariants, K>
  } & {
    readonly [K in Extract<DefaultedKeys<TVariants, TDefaults>, keyof TVariants>]?: VariantValue<TVariants, K>
  } & {
    readonly className?: ClassValue
    readonly class?: ClassValue
  }

  /** Variant props of a CVA function, without `class`/`className`. */
  export type VariantProps<T> = T extends (props?: infer P) => string
    ? Omit<NonNullable<P>, 'class' | 'className'>
    : never
}
