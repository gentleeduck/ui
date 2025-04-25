import { VariantProps, VariantsOptions } from './variants.types'

/**
 * Utility function to generate class names based on variant options.
 *
 * @template TVariants - A record mapping variant names to variant values and their corresponding class names.
 *
 * @param base - A base string of class names that will always be applied.
 * @param options - An object that includes:
 *  - `variants`: a mapping of variant names to their possible values and the class name associated with each value.
 *  - `defaultVariants`: optional default values to apply for variants if none are provided.
 *
 * @returns A function that accepts an optional props object:
 *  - Includes variant values (from TVariants),
 *  - And optional `className` or `class` fields for additional class names.
 *
 * The function returns a string of unique class names.
 *
 * @example
 * ```ts
 * const button = cva('btn', {
 *   variants: {
 *     size: {
 *       sm: 'btn-sm',
 *       lg: 'btn-lg',
 *     },
 *     color: {
 *       primary: 'btn-primary',
 *       secondary: 'btn-secondary',
 *     },
 *   },
 *   defaultVariants: {
 *     size: 'sm',
 *     color: 'primary',
 *   },
 * })
 *
 * const className = button({ size: 'lg', className: 'extra-class' })
 * // className => 'btn btn-lg btn-primary extra-class'
 * ```
 */
export function cva<TVariants extends Record<string, Record<string, string>>>(
  base: string,
  options: VariantsOptions<TVariants>,
): (
  props?: VariantProps<TVariants> & { className?: string; class?: string },
) => string {
  const { variants, defaultVariants } = options

  return (props = {}) => {
    const classSet = new Set<string>()

    // Add base classes
    for (const cls of base.split(/\s+/)) {
      classSet.add(cls)
    }

    // Apply variants with fallbacks to defaultVariants
    for (const key in variants) {
      const propValue = props[key as keyof TVariants]
      const value =
        propValue !== undefined
          ? propValue
          : defaultVariants?.[key as keyof typeof defaultVariants]

      const variantClass = value && variants[key]?.[value as string]
      if (variantClass) {
        for (const cls of variantClass.split(/\s+/)) {
          classSet.add(cls)
        }
      }
    }

    // Add `className` or `class` from props
    if ('className' in props && props.className) {
      for (const cls of props.className.split(/\s+/)) {
        classSet.add(cls)
      }
    }

    if ('class' in props && props.class) {
      for (const cls of props.class.split(/\s+/)) {
        classSet.add(cls)
      }
    }

    return Array.from(classSet).join(' ')
  }
}
//
