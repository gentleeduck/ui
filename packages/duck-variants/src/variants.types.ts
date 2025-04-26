export type VariantParams<
  TVariants extends Record<string, Record<string, string | string[]>>,
> = {
  [K in keyof TVariants]?: keyof TVariants[K] | Array<keyof TVariants[K]>
}

export interface VariantsOptions<
  TVariants extends Record<string, Record<string, string | string[]>>,
> {
  variants: TVariants

  defaultVariants?: VariantParams<TVariants>

  compoundVariants?: Array<
    VariantParams<TVariants> & {
      class?: ClassValue
      className?: ClassValue
    }
  >
}

export type CvaProps<
  TVariants extends Record<string, Record<string, string | string[]>>,
> = VariantParams<TVariants> & {
  className?: ClassValue
  class?: ClassValue
}

export type VariantProps<T> = T extends (props?: infer P) => any
  ? {
      [K in keyof P as K extends 'class' | 'className' ? never : K]-?: Exclude<
        P[K],
        undefined
      >
    }
  : never

export type ClassDictionary = Record<string, boolean | undefined>
export type ClassArray = ClassValue[]
export type ClassValue =
  | string
  | number
  | boolean
  | ClassDictionary
  | ClassArray
