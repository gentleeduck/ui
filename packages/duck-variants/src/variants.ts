import type { Variants } from './variants.types'
import { UNSET } from './variants.types'

/** @internal LRU cap; oldest evicted via Map insertion order. */
const PRELUDE_CACHE_MAX = 256

const CLASS_KEYS: ReadonlySet<string> = new Set(['class', 'className'])

type Accum = {
  out: string
  seen: Set<string>
  /** Read-only filter — lets a stable seen set be shared without cloning. */
  filter: ReadonlySet<string> | null
  /** Layered second filter, same semantics as `filter`. */
  filter2: ReadonlySet<string> | null
}

function pushToken(acc: Accum, t: string): void {
  if (t.length === 0) return
  if (acc.seen.has(t)) return
  if (acc.filter?.has(t)) return
  if (acc.filter2?.has(t)) return
  acc.seen.add(t)
  acc.out = acc.out.length === 0 ? t : `${acc.out} ${t}`
}

/**
 * Local clsx-equivalent. Dedup is integral: tokens flow through `seen` + `filter`
 * Sets, so duplicates strip on the way in. A separate clsx pass would force re-tokenize
 * or reintroduce dupes. Whitespace-free fast path targets `className={x}`.
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
 * Compose class names from base + variants + compounds.
 * Signatures: `cva(base, options)` or `cva({ base, ...options })`.
 *
 * `null`/`undefined`/{@link UNSET} variant props SKIP the variant (no default fallback).
 * Tokens dedup first-seen across base/variants/compounds/dynamic. Variant prelude memoized
 * (LRU {@link PRELUDE_CACHE_MAX}); dynamic class/className appended without cache invalidation.
 * Type-level: defaulted keys optional, non-defaulted required ({@link Variants.Props}).
 */
export function cva<
  const TVariants extends Variants.VariantDefinitions,
  const TDefaults extends Variants.VariantParams<TVariants> | undefined = undefined,
>(
  baseOrOptions: string | (Variants.Config<TVariants> & { defaultVariants?: TDefaults }),
  maybeOptions?: Variants.Options<TVariants> & { defaultVariants?: TDefaults },
): (props?: Variants.Props<TVariants, TDefaults>) => string {
  const config: Variants.Config<TVariants> =
    typeof baseOrOptions === 'string' ? { base: baseOrOptions, ...maybeOptions } : baseOrOptions

  const { base = '', variants, defaultVariants, compoundVariants = [] } = config

  const baseAcc: Accum = { out: '', seen: new Set<string>(), filter: null, filter2: null }
  appendClassValue(baseAcc, base)
  const baseString = baseAcc.out
  const baseSeen: ReadonlySet<string> = baseAcc.seen

  const variantKeys: string[] = variants ? Object.keys(variants) : []
  const variantKeyCount = variantKeys.length

  // Pre-tokenize each variant option so the prelude builder iterates string[]
  // rather than re-flattening a ClassValue per call.
  const variantTokens: Record<string, Record<string, string[]>> = {}
  if (variants) {
    for (let i = 0; i < variantKeyCount; i++) {
      const k = variantKeys[i] as string
      const options = variants[k]
      if (!options) continue
      const map: Record<string, string[]> = {}
      for (const opt in options) {
        const acc: Accum = { out: '', seen: new Set<string>(), filter: null, filter2: null }
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
      if (CLASS_KEYS.has(key)) continue
      const raw = (cv as Record<string, unknown>)[key]
      if (Array.isArray(raw)) {
        conditions.push({ key, set: new Set(raw.map(String)), value: null })
      } else {
        conditions.push({ key, set: null, value: String(raw) })
      }
    }
    const acc: Accum = { out: '', seen: new Set<string>(), filter: null, filter2: null }
    appendClassValue(acc, cv.class)
    appendClassValue(acc, cv.className)
    return { conditions, tokens: acc.out.length === 0 ? [] : acc.out.split(' ') }
  })

  const defaults = (defaultVariants ?? {}) as Record<string, unknown>

  type Prelude = { str: string; seen: Set<string> }
  // Keyed by variant-prop state only — dynamic class/className stays out of
  // the key so unique user classNames still hit the cache. Capped at
  // PRELUDE_CACHE_MAX with insertion-order LRU eviction.
  const preludeCache = new Map<string, Prelude>()
  // Pre-allocated key parts buffer: filled by index then joined. Cheaper than
  // repeated template-literal concat on V8 for high-variant-count instances.
  const keyParts: string[] = new Array(variantKeyCount)

  return (props?: Variants.Props<TVariants, TDefaults>): string => {
    const rawProps = (props ?? {}) as Record<string, unknown>
    const dynamicClassName = rawProps.className as Variants.ClassValue | undefined
    const dynamicClass = rawProps.class as Variants.ClassValue | undefined
    const hasDynamic = dynamicClassName != null || dynamicClass != null

    for (let i = 0; i < variantKeyCount; i++) {
      const k = variantKeys[i] as string
      const explicit = k in rawProps
      const raw = explicit ? rawProps[k] : defaults[k]
      const skip = raw == null || raw === UNSET
      keyParts[i] = skip ? `${k}:__` : `${k}:${String(raw)}`
    }
    const cacheKey = keyParts.join('|')

    let prelude = preludeCache.get(cacheKey)
    if (prelude === undefined) {
      // baseSeen reused as read-only filter (no clone). Delta-only `seen` is stored on prelude;
      // dynamic path layers it as filter2, avoiding base/prelude union clone.
      const acc: Accum = {
        out: baseString,
        seen: new Set<string>(),
        filter: baseSeen,
        filter2: null,
      }

      for (let i = 0; i < variantKeyCount; i++) {
        const k = variantKeys[i] as string
        const explicit = k in rawProps
        const raw = explicit ? rawProps[k] : defaults[k]
        if (raw == null || raw === UNSET) continue
        const tokens = variantTokens[k]?.[String(raw)]
        if (!tokens) continue
        for (let j = 0; j < tokens.length; j++) pushToken(acc, tokens[j] as string)
      }

      for (let i = 0; i < compiledCompounds.length; i++) {
        const compound = compiledCompounds[i] as CompiledCompound
        const { conditions, tokens } = compound

        let match = true
        for (let j = 0; j < conditions.length; j++) {
          const { key, set, value } = conditions[j] as CompiledCompound['conditions'][number]
          const explicit = key in rawProps
          const actual = explicit ? rawProps[key] : defaults[key]
          if (actual == null || actual === UNSET) {
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

        for (let j = 0; j < tokens.length; j++) pushToken(acc, tokens[j] as string)
      }

      prelude = { str: acc.out, seen: acc.seen }

      if (preludeCache.size >= PRELUDE_CACHE_MAX) {
        const oldest = preludeCache.keys().next().value
        if (oldest !== undefined) preludeCache.delete(oldest)
      }
      preludeCache.set(cacheKey, prelude)
    }

    if (!hasDynamic) return prelude.str

    // Fast path: exactly one of class/className is a whitespace-free string.
    const singleStr =
      typeof dynamicClassName === 'string' && dynamicClass == null
        ? dynamicClassName
        : typeof dynamicClass === 'string' && dynamicClassName == null
          ? dynamicClass
          : null
    if (singleStr !== null && singleStr.length > 0 && !/\s/.test(singleStr)) {
      if (baseSeen.has(singleStr) || prelude.seen.has(singleStr)) return prelude.str
      return prelude.str.length === 0 ? singleStr : `${prelude.str} ${singleStr}`
    }

    // baseSeen + prelude.seen layered as read-only filters; avoids cloning either Set per call.
    const acc: Accum = {
      out: prelude.str,
      seen: new Set<string>(),
      filter: baseSeen,
      filter2: prelude.seen,
    }
    if (dynamicClassName != null) appendClassValue(acc, dynamicClassName)
    if (dynamicClass != null) appendClassValue(acc, dynamicClass)
    return acc.out
  }
}
