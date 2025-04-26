import { VariantParams, VariantProps, VariantsOptions } from './variants.types'

export function cva<
  TVariants extends Record<string, Record<string, string | Array<string>>>,
>(
  base: string,
  options: VariantsOptions<TVariants>,
): (
  props?: VariantParams<TVariants> & {
    className?: string | Array<string>
    class?: string | Array<string>
  },
) => string {
  const { variants, defaultVariants, compoundVariants } = options
  const cache = new Map<string, string>()

  return (props = {}) => {
    const cacheKey = JSON.stringify(props)
    if (cache.has(cacheKey)) return cache.get(cacheKey)!

    const classSet = new Set<string>()

    // Add base classes
    for (const cls of base.split(/\s+/)) {
      classSet.add(cls)
    }

    const resolvedVariants: Record<string, string | undefined> = {}

    for (const key in variants) {
      const propValue = props[key as keyof TVariants]
      const value =
        propValue !== undefined
          ? propValue
          : defaultVariants?.[key as keyof typeof defaultVariants]

      resolvedVariants[key] = value as string

      const variantClasses = variants[key]?.[value as string]

      if (Array.isArray(variantClasses)) {
        for (const cls of variantClasses) {
          classSet.add(cls)
        }
      } else if (variantClasses) {
        for (const cls of variantClasses.split(/\s+/)) {
          classSet.add(cls)
        }
      }
    }

    if (compoundVariants?.length) {
      for (const compound of compoundVariants) {
        const {
          class: compoundClass,
          className: compoundClassName,
          ...compoundConditions
        } = compound
        const isMatch = Object.entries(compoundConditions).every(
          ([key, value]) => resolvedVariants[key] === value,
        )

        if (isMatch) {
          if (compoundClass) {
            for (const cls of (compoundClass as string).split(/\s+/)) {
              classSet.add(cls)
            }
          }
          if (compoundClassName) {
            for (const cls of (compoundClassName as string).split(/\s+/)) {
              classSet.add(cls)
            }
          }
        }
      }
    }

    for (const key of ['className', 'class'] as const) {
      if (props[key]) {
        const values = Array.isArray(props[key]) ? props[key] : [props[key]]
        for (const cls of values.flat()) {
          classSet.add(cls)
        }
      }
    }

    const finalClassName = Array.from(classSet).join(' ')
    cache.set(cacheKey, finalClassName)
    return finalClassName
  }
}
