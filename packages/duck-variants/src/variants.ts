import type { Variants } from './variants.types'

type Accum = {
  out: string
  seen: Set<string>
  /** Read-only filter of tokens already present (lets prelude `seen` be shared without cloning). */
  filter: ReadonlySet<string> | null
}

function pushToken(acc: Accum, t: string): void {
  if (t.length === 0) return
  if (acc.seen.has(t)) return
  if (acc.filter?.has(t)) return
  acc.seen.add(t)
  acc.out = acc.out.length === 0 ? t : `${acc.out} ${t}`
}

// Fast path: whitespace-free strings skip the regex split — most runtime
// className values are single tokens, so this dominates cold-call cost.
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
 * CVA function for composing class names from base + variants + compounds.
 *
 * Two signatures: `cva(base, options)` or `cva({ base, ...options })`.
 *
 * Null/undefined variant props skip the variant (they do NOT fall back to the
 * default) — passing `{ size: undefined }` produces no `size` classes.
 *
 * Tokens are deduplicated first-seen across base, variants, compounds, and
 * user-supplied class/className. The variant-only prelude is memoized per
 * variant-prop combination; dynamic class/className is appended without
 * invalidating the cache.
 */
export function cva<TVariants extends Variants.VariantDefinitions>(
  baseOrOptions: string | Variants.Config<TVariants>,
  maybeOptions?: Variants.Options<TVariants>,
): (props?: Variants.Props<TVariants>) => string {
  const config: Variants.Config<TVariants> =
    typeof baseOrOptions === 'string' ? { base: baseOrOptions, ...maybeOptions } : baseOrOptions

  const { base = '', variants, defaultVariants, compoundVariants = [] } = config

  const baseAcc: Accum = { out: '', seen: new Set<string>(), filter: null }
  appendClassValue(baseAcc, base)
  const baseString = baseAcc.out
  const baseSeen = baseAcc.seen

  const variantKeys: string[] = variants ? Object.keys(variants) : []

  // Pre-tokenize each variant option so the prelude builder iterates string[]
  // rather than re-flattening a ClassValue per call.
  const variantTokens: Record<string, Record<string, string[]>> = {}
  if (variants) {
    for (const k of variantKeys) {
      const options = variants[k]
      if (!options) continue
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
      const raw = cv[key]
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
  // Keyed by variant-prop state only — dynamic class/className stays out of
  // the key so unique user classNames still hit the cache.
  const preludeCache = new Map<string, Prelude>()

  return (props: Variants.Props<TVariants> = {} as Variants.Props<TVariants>): string => {
    const rawProps = props
    const dynamicClassName = rawProps.className
    const dynamicClass = rawProps.class
    const hasDynamic = dynamicClassName != null || dynamicClass != null

    let cacheKey = ''
    for (const k of variantKeys) {
      const explicit = k in rawProps
      const raw = explicit ? rawProps[k] : defaults[k]
      const skip = raw == null || raw === 'unset'
      cacheKey += `${k}:${skip ? '__' : String(raw)}|`
    }

    let prelude = preludeCache.get(cacheKey)
    if (prelude === undefined) {
      const acc: Accum = { out: baseString, seen: new Set(baseSeen), filter: null }

      for (const k of variantKeys) {
        const explicit = k in rawProps
        const raw = explicit ? rawProps[k] : defaults[k]
        if (raw == null || raw === 'unset') continue
        const tokens = variantTokens[k]?.[String(raw)]
        if (!tokens) continue
        for (const token of tokens) pushToken(acc, token)
      }

      for (const compound of compiledCompounds) {
        const { conditions, tokens } = compound

        let match = true
        for (const { key, set, value } of conditions) {
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

        for (const token of tokens) pushToken(acc, token)
      }

      prelude = { str: acc.out, seen: acc.seen }
      preludeCache.set(cacheKey, prelude)
    }

    if (!hasDynamic) return prelude.str

    // Fast path: exactly one of class/className is a whitespace-free string
    // (the common React `className={x}` case). Skips Accum + Set alloc.
    const singleStr =
      typeof dynamicClassName === 'string' && dynamicClass == null
        ? dynamicClassName
        : typeof dynamicClass === 'string' && dynamicClassName == null
          ? dynamicClass
          : null
    if (singleStr !== null && singleStr.length > 0 && !/\s/.test(singleStr)) {
      if (prelude.seen.has(singleStr)) return prelude.str
      return prelude.str.length === 0 ? singleStr : `${prelude.str} ${singleStr}`
    }

    // prelude.seen used as read-only filter — avoids cloning the Set per call.
    const acc: Accum = { out: prelude.str, seen: new Set<string>(), filter: prelude.seen }
    if (dynamicClassName != null) appendClassValue(acc, dynamicClassName as Variants.ClassValue)
    if (dynamicClass != null) appendClassValue(acc, dynamicClass as Variants.ClassValue)
    return acc.out
  }
}
