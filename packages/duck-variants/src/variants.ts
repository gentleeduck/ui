import type { Variants } from './variants.types'

/**
 * Mutable accumulator that collects CSS tokens with first-seen deduplication.
 *
 * `out` is the space-joined result string; `seen` tracks which tokens have
 * already been added so duplicates (across base, variants, compounds, and
 * user-supplied class/className) are silently skipped.
 *
 * @internal
 */
type Accum = {
  out: string
  seen: Set<string>
  /** Optional read-only filter of tokens already present in `out`. */
  filter: ReadonlySet<string> | null
}

/**
 * Appends a single token to an accumulator, deduping against previously
 * added tokens and against any read-only filter set (used to skip tokens
 * already present in a cached prelude without cloning its Set).
 *
 * @internal
 */
function pushToken(acc: Accum, t: string): void {
  if (t.length === 0) return
  if (acc.seen.has(t)) return
  if (acc.filter !== null && acc.filter.has(t)) return
  acc.seen.add(t)
  acc.out = acc.out.length === 0 ? t : acc.out + ' ' + t
}

/**
 * Appends tokens from any {@link Variants.ClassValue} onto an accumulator.
 *
 * Supports strings (whitespace-split), numbers/bigints, nested arrays, and
 * `{ className: boolean }` dictionaries. Boolean, null, and undefined inputs
 * are ignored, which makes expressions like `isActive && "active"` safe in
 * class arrays.
 *
 * Fast path: a string with no whitespace bypasses the regex split and goes
 * straight to the accumulator. The vast majority of runtime className values
 * are single tokens (e.g., `"k-42"`, `"custom"`), so the fast path dominates
 * cold-call cost.
 *
 * @internal
 */
function appendClassValue(acc: Accum, input: Variants.ClassValue | undefined): void {
  if (input == null || typeof input === 'boolean') return

  if (typeof input === 'string') {
    if (input.length === 0) return
    if (!/\s/.test(input)) {
      pushToken(acc, input)
      return
    }
    const parts = input.split(/\s+/)
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (part) pushToken(acc, part)
    }
    return
  }

  if (typeof input === 'number' || typeof input === 'bigint') {
    pushToken(acc, String(input))
    return
  }

  if (Array.isArray(input)) {
    for (let i = 0; i < input.length; i++) {
      appendClassValue(acc, input[i])
    }
    return
  }

  if (typeof input === 'object') {
    const dict = input as Variants.ClassDictionary
    for (const k in dict) {
      if (Object.hasOwn(dict, k) && dict[k]) pushToken(acc, k)
    }
  }
}

/**
 * Creates a Class Variance Authority (CVA) function for composing class names
 * from a base, variants, defaults, and compound variants.
 *
 * Two call signatures are supported:
 * - `cva(base, options)`
 * - `cva({ base, ...options })`
 *
 * The variant-only prelude (base + variants + compounds, with no user
 * `class`/`className`) is memoized per variant-prop combination. Dynamic
 * `class`/`className` is appended on top without invalidating the cache, so
 * cold-path calls (unique className each time) only pay for the final merge.
 *
 * Null/undefined variant props override defaults: passing `{ size: undefined }`
 * skips the `size` variant entirely instead of falling back to the default.
 *
 * Output tokens are deduplicated on first-seen order across all sources.
 *
 * @template TVariants - Mapping of variant names to their class option maps.
 * @param baseOrOptions - Either the base class string, or a full config including `base`.
 * @param maybeOptions - The options object when using the two-arg signature.
 * @returns A function that resolves variant props into a class string.
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
 *     { intent: ['primary', 'danger'], size: 'lg', className: 'uppercase' },
 *   ],
 * })
 * ```
 */
export function cva<TVariants extends Variants.VariantDefinitions>(
  baseOrOptions: string | Variants.Config<TVariants>,
  maybeOptions?: Variants.Options<TVariants>,
): (props?: Variants.Props<TVariants>) => string {
  const config: Variants.Config<TVariants> =
    typeof baseOrOptions === 'string' ? { base: baseOrOptions, ...maybeOptions } : baseOrOptions

  const { base = '', variants, defaultVariants, compoundVariants = [] } = config

  // Pre-resolve the base into a deduped string + its seen-set, so the prelude
  // builder can start from this snapshot without re-walking the base each time.
  const baseAcc: Accum = { out: '', seen: new Set<string>(), filter: null }
  appendClassValue(baseAcc, base)
  const baseString = baseAcc.out
  const baseSeen = baseAcc.seen

  const variantKeys: string[] = variants ? Object.keys(variants) : []

  // Pre-tokenize each variant option so the prelude builder can just iterate
  // an array of tokens rather than re-flatten a ClassValue every time.
  const variantTokens: Record<string, Record<string, string[]>> = {}
  if (variants) {
    for (let i = 0; i < variantKeys.length; i++) {
      const k = variantKeys[i]!
      const options = variants[k]!
      const map: Record<string, string[]> = {}
      for (const opt in options) {
        const acc: Accum = { out: '', seen: new Set<string>(), filter: null }
        appendClassValue(acc, options[opt])
        map[opt] = acc.out.length === 0 ? [] : acc.out.split(' ')
      }
      variantTokens[k] = map
    }
  }

  type CompiledCompound = {
    conditions: Array<{ key: string; set: Set<string> | null; value: string | null }>
    tokens: string[]
  }

  const compiledCompounds: CompiledCompound[] = compoundVariants.map((cv) => {
    const conditions: CompiledCompound['conditions'] = []
    for (const key in cv) {
      if (key === 'class' || key === 'className') continue
      const raw = (cv as Record<string, unknown>)[key]
      if (Array.isArray(raw)) {
        conditions.push({ key, set: new Set(raw.map(String)), value: null })
      } else {
        conditions.push({ key, set: null, value: String(raw) })
      }
    }
    const acc: Accum = { out: '', seen: new Set<string>(), filter: null }
    appendClassValue(acc, cv.class)
    appendClassValue(acc, cv.className)
    return { conditions, tokens: acc.out.length === 0 ? [] : acc.out.split(' ') }
  })

  const defaults = (defaultVariants ?? {}) as Record<string, unknown>

  type Prelude = { str: string; seen: Set<string> }
  // Keyed by variant-prop state only. Dynamic class/className never enters the
  // key, so a unique user className per call still hits the prelude cache.
  const preludeCache = new Map<string, Prelude>()

  return (props: Variants.Props<TVariants> = {} as Variants.Props<TVariants>): string => {
    const rawProps = props as Record<string, unknown>
    const dynamicClassName = rawProps.className
    const dynamicClass = rawProps.class
    const hasDynamic = dynamicClassName != null || dynamicClass != null

    let cacheKey = ''
    for (let i = 0; i < variantKeys.length; i++) {
      const k = variantKeys[i]!
      const explicit = k in rawProps
      const raw = explicit ? rawProps[k] : defaults[k]
      const skip = raw == null || raw === 'unset'
      cacheKey += k + ':' + (skip ? '__' : String(raw)) + '|'
    }

    let prelude = preludeCache.get(cacheKey)
    if (prelude === undefined) {
      const acc: Accum = { out: baseString, seen: new Set(baseSeen), filter: null }

      for (let i = 0; i < variantKeys.length; i++) {
        const k = variantKeys[i]!
        const explicit = k in rawProps
        const raw = explicit ? rawProps[k] : defaults[k]
        if (raw == null || raw === 'unset') continue
        const tokens = variantTokens[k]?.[String(raw)]
        if (!tokens) continue
        for (let j = 0; j < tokens.length; j++) pushToken(acc, tokens[j]!)
      }

      for (let i = 0; i < compiledCompounds.length; i++) {
        const compound = compiledCompounds[i]!
        const { conditions, tokens } = compound

        let match = true
        for (let j = 0; j < conditions.length; j++) {
          const { key, set, value } = conditions[j]!
          const explicit = key in rawProps
          const actual = explicit ? rawProps[key] : defaults[key]
          if (actual == null || actual === 'unset') {
            match = false
            break
          }
          if (set !== null) {
            if (!set.has(String(actual))) {
              match = false
              break
            }
          } else if (String(actual) !== value) {
            match = false
            break
          }
        }
        if (!match) continue

        for (let j = 0; j < tokens.length; j++) pushToken(acc, tokens[j]!)
      }

      prelude = { str: acc.out, seen: acc.seen }
      preludeCache.set(cacheKey, prelude)
    }

    if (!hasDynamic) return prelude.str

    // Fast path: exactly one of class/className is a single-token string
    // (the overwhelmingly common case in React components passing
    // `className={someString}`). Skips Accum allocation and the Set for
    // dynamic tokens.
    const singleStr =
      typeof dynamicClassName === 'string' && dynamicClass == null
        ? dynamicClassName
        : typeof dynamicClass === 'string' && dynamicClassName == null
          ? dynamicClass
          : null
    if (singleStr !== null && singleStr.length > 0 && !/\s/.test(singleStr)) {
      if (prelude.seen.has(singleStr)) return prelude.str
      return prelude.str.length === 0 ? singleStr : prelude.str + ' ' + singleStr
    }

    // General path: use prelude.seen as a read-only filter instead of cloning
    // it. Only the dynamic tokens need to be tracked in `seen` for per-call dedup.
    const acc: Accum = { out: prelude.str, seen: new Set<string>(), filter: prelude.seen }
    if (dynamicClassName != null) appendClassValue(acc, dynamicClassName as Variants.ClassValue)
    if (dynamicClass != null) appendClassValue(acc, dynamicClass as Variants.ClassValue)
    return acc.out
  }
}
