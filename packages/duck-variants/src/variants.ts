import { ClassValue, CvaProps, VariantsOptions } from './variants.types'

/**
 * Sort keys and serialize for a stable memo key
 */
function getCacheKey<
  TVariants extends Record<string, Record<string, string | string[]>>,
>(props: CvaProps<TVariants>): string {
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
 * Flatten any ClassValue into space-separated tokens
 */
function flattenClasses(input: ClassValue | undefined, tokens: string[]): void {
  if (input === undefined || input === null) return

  // primitives
  if (
    typeof input === 'string' ||
    typeof input === 'number' ||
    typeof input === 'boolean'
  ) {
    const parts = String(input).split(/\s+/)
    // biome-ignore lint/style/useForOf: <explanation>
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (part) tokens.push(part)
    }
    return
  }

  // arrays
  if (Array.isArray(input)) {
    // biome-ignore lint/style/useForOf: <explanation>
    for (let i = 0; i < input.length; i++) {
      flattenClasses(input[i], tokens)
    }
    return
  }

  // object dictionary
  for (const key in input) {
    // own, truthy entries only
    if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
      tokens.push(key)
    }
  }
}

export function cva<
  TVariants extends Record<string, Record<string, string | string[]>>,
>(
  baseOrOptions: string | (VariantsOptions<TVariants> & { base?: string }),
  maybeOptions?: VariantsOptions<TVariants>,
): (props?: CvaProps<TVariants>) => string {
  // normalize call
  const config =
    typeof baseOrOptions === 'string'
      ? { base: baseOrOptions, ...maybeOptions! }
      : baseOrOptions

  const {
    base = '',
    variants,
    defaultVariants = {},
    compoundVariants = [],
  } = config

  // simple memo cache
  const cache = new Map<string, string>()

  return function (
    props: CvaProps<TVariants> = {} as CvaProps<TVariants>,
  ): string {
    // memo lookup
    const cacheKey = getCacheKey(props)
    const memo = cache.get(cacheKey)
    if (memo) return memo

    const tokens: string[] = []
    const seen = new Set<string>()

    // 1) base
    flattenClasses(base, tokens)

    // 2) merge defaults + props
    const merged = { ...defaultVariants, ...props } as Record<
      keyof TVariants,
      ClassValue
    >

    // 3) variants
    for (const variantName in variants) {
      const v = merged[variantName]
      if (v == null || v === 'unset') continue

      const map = variants[variantName]
      const cls = map[String(v)]
      flattenClasses(cls, tokens)
    }

    // 4) compound
    // biome-ignore lint/style/useForOf: <explanation>
    for (let i = 0; i < compoundVariants.length; i++) {
      const cv = compoundVariants[i]!
      let match = true

      // check each condition (except class/className)
      for (const key in cv) {
        if (key === 'class' || key === 'className') continue

        const cond = cv[key as keyof typeof cv]!
        const actual = merged[key as keyof typeof merged]

        if (Array.isArray(cond)) {
          if (!cond.includes(actual)) {
            match = false
            break
          }
        } else {
          if (actual !== cond) {
            match = false
            break
          }
        }
      }

      if (!match) continue

      flattenClasses(cv.class, tokens)
      flattenClasses(cv.className, tokens)
    }

    // 5) extra from props
    flattenClasses(props.className, tokens)
    flattenClasses(props.class, tokens)

    // dedupe + join
    // biome-ignore lint/style/useForOf: <explanation>
    for (let i = 0; i < tokens.length; i++) {
      seen.add(tokens[i]!)
    }
    const result = Array.from(seen).join(' ')
    cache.set(cacheKey, result)
    return result
  }
}
