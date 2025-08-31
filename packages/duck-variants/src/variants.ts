import type { ClassValue, CvaProps, VariantsOptions } from './variants.types'

/**
 * Build a stable cache key by serializing props entries in sorted order.
 *
 * @template TVariants
 *   The mapping of variant names to their allowed string/string[] classes.
 *
 * @param {CvaProps<TVariants>} props
 *   The props object passed into the CVA function (variant selections + class/className).
 *
 * @returns {string}
 *   A deterministic string key used for memoization.
 *
 * @example
 * ```ts
 * getCacheKey({ intent: 'primary', size: ['sm', 'md'], className: 'mt-4' })
 * // => "className:mt-4|intent:primary|size:[sm,md]"
 * ```
 */
function getCacheKey<TVariants extends Record<string, Record<string, string | string[]>>>(
  props: CvaProps<TVariants>,
): string {
  const entries = Object.entries(props) as [string, ClassValue][]

  let key = ''
  for (let i = 0; i < entries.length; i++) {
    const [k, v] = entries[i]
    if (Array.isArray(v)) {
      key += `${k}:[${v.map(String).join(',')}]`
    } else {
      key += `${k}:${String(v)}`
    }
    if (i < entries.length - 1) key += '|'
  }
  return key
}

/**
 * Recursively flattens any supported `ClassValue` into individual CSS tokens.
 *
 * Supports:
 * - primitive strings/numbers/booleans (whitespace-split)
 * - nested arrays of `ClassValue`
 * - dictionaries `{ className: boolean }` for conditional classes
 *
 * @param {ClassValue | undefined} input
 *   The value to flatten into tokens.
 * @param {string[]} tokens
 *   The accumulator array receiving each CSS token.
 *
 * @example
 * ```ts
 * const out: string[] = []
 * flattenClasses(
 *   [
 *     'px-4 py-2',
 *     { 'text-bold': true, invisible: false },
 *     ['hover:bg-red-500', ['active:scale-95']],
 *   ],
 *   out
 * )
 * // out => ['px-4','py-2','text-bold','hover:bg-red-500','active:scale-95']
 * ```
 */
function flattenClasses(input: ClassValue | undefined, tokens: string[]): void {
  if (input === undefined || input === null) return

  // primitive values
  if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    const parts = String(input).split(/\s+/)
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (part) tokens.push(part)
    }
    return
  }

  // arrays of ClassValue
  if (Array.isArray(input)) {
    for (let i = 0; i < input.length; i++) {
      flattenClasses(input[i], tokens)
    }
    return
  }

  // object dictionary `{ className: true }`
  for (const key in input) {
    if (Object.hasOwn(input, key) && input[key]) {
      tokens.push(key)
    }
  }
}

/**
 * Creates a Class Variance Authority (CVA) function for composing class names
 * based on a base string, variants, defaultVariants, and compoundVariants.
 *
 * Supports two call signatures:
 * - `cva(base: string, options: VariantsOptions<TVariants>)`
 * - `cva(options: VariantsOptions<TVariants> & { base: string })`
 *
 * @template TVariants
 *   A record mapping variant keys to a record of allowed values and their classes.
 *
 * @param {string | (VariantsOptions<TVariants> & { base?: string })} baseOrOptions
 *   Either the base class string, or an options object including `base`.
 * @param {VariantsOptions<TVariants>} [maybeOptions]
 *   The options object when using the two-arg signature.
 *
 * @returns {(props?: CvaProps<TVariants>) => string}
 *   A function that, given variant props and optional `class`/`className`, returns
 *   the deduplicated, memoized className string.
 *
 * @example
 * ```ts
 * const button = cva('btn px-4 py-2', {
 *   variants: {
 *     intent: { primary: 'bg-blue-500 text-white', danger: 'bg-red-500' },
 *     size: { sm: 'text-sm', lg: 'text-lg' },
 *   },
 *   defaultVariants: { intent: 'primary', size: 'sm' },
 *   compoundVariants: [
 *     {
 *       intent: ['primary','danger'],
 *       size: 'lg',
 *       className: 'uppercase',
 *     },
 *   ],
 * })
 *
 * // uses defaults + compound match
 * button()
 * // => 'btn px-4 py-2 bg-blue-500 text-white text-sm uppercase'
 *
 * // overrides size + adds custom classes
 * button({ size: 'lg', class: ['mt-4','shadow'] })
 * // => 'btn px-4 py-2 bg-blue-500 text-white text-lg uppercase mt-4 shadow'
 * ```
 */
export function cva<TVariants extends Record<string, Record<string, string | string[]>>>(
  baseOrOptions: string | (VariantsOptions<TVariants> & { base?: string }),
  maybeOptions?: VariantsOptions<TVariants>,
): (props?: CvaProps<TVariants>) => string {
  // Normalize the two possible call signatures
  const config = typeof baseOrOptions === 'string' ? { base: baseOrOptions, ...maybeOptions } : baseOrOptions

  const { base = '', variants, defaultVariants = {}, compoundVariants = [] } = config

  // Memoization cache keyed by serialized props
  const cache = new Map<string, string>()

  return (props: CvaProps<TVariants> = {} as CvaProps<TVariants>): string => {
    // 1) Memo lookup
    const cacheKey = getCacheKey(props)
    const memo = cache.get(cacheKey)
    if (memo) return memo

    const tokens: string[] = []
    const seen = new Set<string>()

    // 2) Base classes
    flattenClasses(base, tokens)

    // 3) Merge defaults + incoming props
    const merged = { ...defaultVariants, ...props } as Record<keyof TVariants, ClassValue>

    // 4) Apply variant-specific classes
    for (const variantName in variants) {
      const v = merged[variantName]
      if (v == null || v === 'unset') continue
      const cls = variants[variantName][String(v)]
      flattenClasses(cls, tokens)
    }

    // 5) Apply compoundVariants when all conditions match
    for (let i = 0; i < compoundVariants.length; i++) {
      const cv = compoundVariants[i as number]
      let match = true

      for (const key in cv) {
        if (key === 'class' || key === 'className') continue

        const cond = cv[key as keyof typeof cv]
        const actual = merged[key as keyof typeof merged]

        // array- or single-value condition
        if (Array.isArray(cond) && actual) {
          if (!cond.includes(actual.toString())) {
            match = false
            break
          }
        } else if (actual !== cond) {
          match = false
          break
        }
      }
      if (!match) continue

      flattenClasses(cv.class, tokens)
      flattenClasses(cv.className, tokens)
    }

    // 6) Finally append any `className` or `class` from props
    flattenClasses(props.className, tokens)
    flattenClasses(props.class, tokens)

    // 7) Deduplicate & join
    for (let i = 0; i < tokens.length; i++) {
      seen.add(tokens[i as number])
    }
    const result = Array.from(seen).join(' ')

    cache.set(cacheKey, result)
    return result
  }
}
