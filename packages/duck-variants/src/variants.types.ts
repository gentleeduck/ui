export namespace Variants {
  /** Boolean/null/undefined are ignored so `isActive && "active"` is safe in class arrays. */
  export type ClassPrimitive = string | number | bigint | boolean | null | undefined

  /** Conditional class map: `{ "text-bold": isActive }`. */
  export type ClassDictionary = Readonly<Record<string, boolean | null | undefined>>

  export type ClassArray = ReadonlyArray<ClassValue>

  export type ClassValue = ClassPrimitive | ClassDictionary | ClassArray

  export type VariantClassValue = ClassValue

  export type VariantValueMap = Readonly<Record<string, VariantClassValue>>

  export type VariantDefinitions = Readonly<Record<string, VariantValueMap>>

  export type VariantParams<TVariants extends VariantDefinitions> = {
    readonly [K in keyof TVariants]?: keyof TVariants[K] | ReadonlyArray<keyof TVariants[K]> | null
  }

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

  export type Config<TVariants extends VariantDefinitions> = Options<TVariants> & {
    readonly base?: ClassValue
  }

  export type Props<TVariants extends VariantDefinitions> = VariantParams<TVariants> & {
    readonly className?: ClassValue
    readonly class?: ClassValue
  }

  /** Variant props of a CVA function, without `class`/`className`. */
  export type VariantProps<T> = T extends (props?: infer P) => string
    ? Omit<NonNullable<P>, 'class' | 'className'>
    : never

  export type Infer<T extends Options<VariantDefinitions>> = T['variants']
}
