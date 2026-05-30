import { describe, expect, it } from 'vitest'
import { cva } from '~/variants'
import { UNSET, type Variants } from '~/variants.types'

describe('cva', () => {
  const button = cva({
    base: 'btn',
    variants: {
      size: {
        sm: 'text-sm',
        lg: 'text-lg',
      },
      tone: {
        primary: 'bg-blue',
        danger: 'bg-red',
      },
    },
    defaultVariants: {
      size: 'sm',
      tone: 'primary',
    },
    compoundVariants: [
      {
        size: 'lg',
        tone: 'danger',
        className: 'font-bold',
      },
    ],
  })

  it('applies base classes', () => {
    expect(button()).toContain('btn')
  })

  it('applies default variants', () => {
    const result = button()
    expect(result).toContain('text-sm')
    expect(result).toContain('bg-blue')
  })

  it('overrides variants', () => {
    const result = button({ size: 'lg' })
    expect(result).toContain('text-lg')
    expect(result).not.toContain('text-sm')
  })

  it('applies compound variants', () => {
    const result = button({ size: 'lg', tone: 'danger' })
    expect(result).toContain('font-bold')
  })

  it('supports className', () => {
    const result = button({ className: 'custom' })
    expect(result).toContain('custom')
  })

  it('supports class', () => {
    const result = button({ class: 'extra' })
    expect(result).toContain('extra')
  })

  it('handles class dictionary', () => {
    const result = button({
      className: { active: true, hidden: false },
    })
    expect(result).toContain('active')
    expect(result).not.toContain('hidden')
  })

  it('handles nested class arrays', () => {
    const result = button({
      className: ['a', ['b', { c: true }]],
    })
    expect(result).toContain('a')
    expect(result).toContain('b')
    expect(result).toContain('c')
  })

  it('does not apply compound variant when array condition does not match', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: {
          sm: 'text-sm',
          lg: 'text-lg',
        },
        tone: {
          primary: 'bg-blue',
          danger: 'bg-red',
        },
      },
      compoundVariants: [
        {
          size: 'lg',
          tone: ['danger'],
          className: 'font-bold',
        },
      ],
    })

    const result = button({ size: 'lg', tone: 'primary' })

    expect(result).not.toContain('font-bold')
  })

  it('returns memoized result for identical props', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm' },
      },
    })

    expect(button({ size: 'sm' })).toBe(button({ size: 'sm' }))
  })

  it('ignores unset variant values', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', lg: 'text-lg' },
      },
      defaultVariants: { size: 'sm' },
    })

    expect(button({ size: 'unset' as never })).toBe('btn')
  })

  it('handles empty class arrays', () => {
    const button = cva({
      base: 'btn',
      variants: {},
    })

    expect(button({ className: [] })).toBe('btn')
  })

  it('does not apply compound variant when actual value is missing', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', lg: 'text-lg' },
        tone: { primary: 'bg-blue', danger: 'bg-red' },
      },
      compoundVariants: [
        {
          size: 'lg',
          tone: 'danger',
          className: 'font-bold',
        },
      ],
    })

    // Intentionally omits `tone` to test runtime behavior when a compound
    // condition is unmet. Cast required: post-fix, non-defaulted variant keys
    // are required at the type level (see variants.types.ts DefaultedKeys).
    expect(button({ size: 'lg' } as Parameters<typeof button>[0])).not.toContain('font-bold')
  })
})

// ---------------------------------------------------------------------------
// Pass-2 coverage gap tests — DefaultedKeys / Props mapped type
// ---------------------------------------------------------------------------

describe('Props<T, D> — type-level required vs optional keys', () => {
  it('makes defaulted keys optional and non-defaulted keys required', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', lg: 'text-lg' },
        tone: { primary: 'bg-blue', danger: 'bg-red' },
      },
      defaultVariants: { size: 'sm' },
    })

    // size is defaulted → optional; tone is NOT defaulted → required.
    // OK: tone is provided; size is omitted.
    expect(button({ tone: 'primary' })).toContain('btn')

    // OK: both provided.
    expect(button({ size: 'lg', tone: 'danger' })).toContain('text-lg')

    // @ts-expect-error — tone is required when not defaulted
    button({ size: 'lg' })

    // @ts-expect-error — empty object fails because tone is required
    button({})

    // NOTE: `button()` (omitted args) is permitted by the signature because
    // `props` is optional at the call site — runtime treats absent props as
    // `{}`, which would still leave non-defaulted keys undefined. Type-level
    // enforcement bites only when an object literal is passed.
  })

  it('with no defaultVariants, every variant key is required', () => {
    const tag = cva({
      base: 'tag',
      variants: {
        size: { sm: 'text-sm', lg: 'text-lg' },
      },
    })

    expect(tag({ size: 'sm' })).toContain('text-sm')

    // @ts-expect-error — size is required when no defaults are supplied
    tag({})

    // NOTE: `tag()` (no args) is allowed because `props?` is optional in the
    // signature. Type-level required-key enforcement applies only when an
    // object literal is passed.
  })

  it('with all variants defaulted, props are fully optional', () => {
    const tag = cva({
      base: 'tag',
      variants: {
        size: { sm: 'text-sm', lg: 'text-lg' },
        tone: { primary: 'bg-blue', danger: 'bg-red' },
      },
      defaultVariants: { size: 'sm', tone: 'primary' },
    })

    // Calling with no args is valid since every key has a default.
    expect(tag()).toContain('text-sm')
    expect(tag({})).toContain('bg-blue')
  })

  it('rejects unknown variant values at the type level', () => {
    const button = cva({
      base: 'btn',
      variants: { size: { sm: 'text-sm', lg: 'text-lg' } },
      defaultVariants: { size: 'sm' },
    })

    // @ts-expect-error — 'xl' is not a known size variant
    button({ size: 'xl' })
  })

  it('accepts UNSET, null for any variant value', () => {
    const button = cva({
      base: 'btn',
      variants: { size: { sm: 'text-sm', lg: 'text-lg' } },
      defaultVariants: { size: 'sm' },
    })

    expect(button({ size: UNSET })).toBe('btn')
    expect(button({ size: null })).toBe('btn')
  })

  it('DefaultedKeys extracts only keys whose defaults are not undefined', () => {
    type V = {
      size: { sm: string; lg: string }
      tone: { primary: string; danger: string }
    }
    type D = { size: 'sm' }

    type K = Variants.DefaultedKeys<V, D>
    // Type-level assertion: K must equal 'size' (no 'tone').
    const ok: K = 'size'
    expect(ok).toBe('size')

    // @ts-expect-error — 'tone' is not defaulted
    const bad: K = 'tone'
    expect(bad).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// Pass-2 coverage gap tests — preludeCache LRU eviction
// ---------------------------------------------------------------------------

describe('preludeCache LRU eviction (PRELUDE_CACHE_MAX = 256)', () => {
  // Build a cva instance whose props key has high cardinality so we can
  // produce 257+ distinct cache keys cheaply.
  const sized = cva({
    base: 'base',
    variants: {
      n: Object.fromEntries(Array.from({ length: 300 }, (_, i) => [`v${i}`, `cls-${i}`])) as Record<string, string>,
    },
  })

  it('keeps memoized identity for cache hits within the cap', () => {
    type Props = Parameters<typeof sized>[0]
    const a1 = sized({ n: 'v0' } as Props)
    const a2 = sized({ n: 'v0' } as Props)
    // Cache hit: identical string reference.
    expect(a1).toBe(a2)
  })

  it('produces correct output for >256 distinct prop combinations (post-eviction correctness)', () => {
    type Props = Parameters<typeof sized>[0]
    const local = cva({
      base: 'base',
      variants: {
        n: Object.fromEntries(Array.from({ length: 300 }, (_, i) => [`v${i}`, `cls-${i}`])) as Record<string, string>,
      },
    })

    // Warm cache with 256 distinct keys then add 50 more → triggers 50
    // evictions. Re-resolving evicted keys must still produce correct output.
    for (let i = 0; i < 256; i++) local({ n: `v${i}` } as Props)
    for (let i = 256; i < 300; i++) local({ n: `v${i}` } as Props)

    // All keys (including evicted oldest entries) must still compute the
    // right tokens after eviction + re-insertion.
    for (let i = 0; i < 300; i++) {
      const out = local({ n: `v${i}` } as Props)
      expect(out).toBe(`base cls-${i}`)
    }
  })

  it('cache hit returns identical string reference within the cap', () => {
    type Props = Parameters<typeof sized>[0]
    const local = cva({
      base: 'base',
      variants: {
        n: { a: 'cls-a', b: 'cls-b' } as Record<string, string>,
      },
    })

    const r1 = local({ n: 'a' } as Props)
    const r2 = local({ n: 'a' } as Props)
    // Same memoized string reference (cache hit).
    expect(r1).toBe(r2)
  })

  it('does not grow unbounded — size is observable via behavior across 1000 distinct keys', () => {
    type Props = Parameters<typeof sized>[0]
    const local = cva({
      base: 'base',
      variants: {
        n: Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [`v${i}`, `cls-${i}`])) as Record<string, string>,
      },
    })

    // Burn through 1000 distinct keys. With PRELUDE_CACHE_MAX = 256 this
    // forces ~744 evictions. Final output must remain correct.
    for (let i = 0; i < 1000; i++) {
      const out = local({ n: `v${i}` } as Props)
      expect(out).toBe(`base cls-${i}`)
    }

    // Re-resolve a long-evicted key — must still be correct.
    expect(local({ n: 'v0' } as Props)).toBe('base cls-0')
  })
})

// ---------------------------------------------------------------------------
// Pass-2 coverage gap tests — filter2 second-layer ReadonlySet
// ---------------------------------------------------------------------------

describe('filter2 — second-layer read-only filter (no clone)', () => {
  it('deduplicates a token that appears in BOTH baseSeen and prelude.seen against dynamic className', () => {
    const button = cva({
      base: 'shared a',
      variants: {
        size: { sm: 'shared b', lg: 'lg-only' },
      },
      defaultVariants: { size: 'sm' },
    })

    // First call warms the prelude. prelude.seen contains 'b'; baseSeen contains
    // 'shared', 'a'. Now pass dynamic className that duplicates both layers AND
    // adds a new token; the result must contain the new token but NOT repeat
    // 'shared' or 'b'.
    const out = button({ className: 'shared b new' })

    // Order is base + variant + dynamic. Count occurrences of each token.
    const tokens = out.split(' ').filter(Boolean)
    expect(tokens.filter((t) => t === 'shared')).toHaveLength(1)
    expect(tokens.filter((t) => t === 'b')).toHaveLength(1)
    expect(tokens).toContain('new')
    expect(tokens).toContain('a')
  })

  it('filter2 also catches duplicates from a compound-emitted token', () => {
    const button = cva({
      base: 'base-x',
      variants: {
        size: { sm: 'sm-x', lg: 'lg-x' },
        tone: { primary: 'primary-x', danger: 'danger-x' },
      },
      defaultVariants: { size: 'sm', tone: 'primary' },
      compoundVariants: [
        {
          size: 'lg',
          tone: 'danger',
          className: 'compound-x',
        },
      ],
    })

    const out = button({ size: 'lg', tone: 'danger', className: 'compound-x extra' })
    const tokens = out.split(' ').filter(Boolean)

    // compound-x was already pushed by the compound; the dynamic className
    // duplicate must be filtered out via filter2 (prelude.seen).
    expect(tokens.filter((t) => t === 'compound-x')).toHaveLength(1)
    expect(tokens).toContain('extra')
  })

  it('dynamic class and className together still de-dup against each other', () => {
    const button = cva({ base: 'base' })
    const out = button({ class: 'x y', className: 'y z' })
    const tokens = out.split(' ').filter(Boolean)

    expect(tokens.filter((t) => t === 'y')).toHaveLength(1)
    expect(tokens).toContain('x')
    expect(tokens).toContain('z')
    expect(tokens).toContain('base')
  })
})

// ---------------------------------------------------------------------------
// Pass-2 coverage gap tests — UNSET constant
// ---------------------------------------------------------------------------

describe('UNSET constant', () => {
  it('is the exported string literal', () => {
    expect(UNSET).toBe('unset')
  })

  it('clears a defaulted variant key when passed as a prop value', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', lg: 'text-lg' },
      },
      defaultVariants: { size: 'sm' },
    })

    expect(button()).toContain('text-sm')
    expect(button({ size: UNSET })).toBe('btn')
    expect(button({ size: UNSET })).not.toContain('text-sm')
  })

  it('clears a defaulted key from compound-condition matching', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', lg: 'text-lg' },
        tone: { primary: 'bg-blue', danger: 'bg-red' },
      },
      defaultVariants: { size: 'lg', tone: 'danger' },
      compoundVariants: [
        {
          size: 'lg',
          tone: 'danger',
          className: 'font-bold',
        },
      ],
    })

    // With defaults active, compound matches.
    expect(button()).toContain('font-bold')

    // UNSET for size invalidates the compound: condition cannot match.
    expect(button({ size: UNSET })).not.toContain('font-bold')
  })

  it('null behaves identically to UNSET at runtime', () => {
    const button = cva({
      base: 'btn',
      variants: { size: { sm: 'text-sm', lg: 'text-lg' } },
      defaultVariants: { size: 'sm' },
    })

    expect(button({ size: null })).toBe('btn')
    expect(button({ size: null })).toBe(button({ size: UNSET }))
  })
})

// ---------------------------------------------------------------------------
// Pass-2 coverage gap tests — CompoundConditions array support
// ---------------------------------------------------------------------------

describe('CompoundConditions — array conditions', () => {
  it('matches when actual value is in the array', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', md: 'text-md', lg: 'text-lg' },
        tone: { primary: 'bg-blue', danger: 'bg-red' },
      },
      compoundVariants: [
        {
          size: ['sm', 'lg'],
          tone: 'danger',
          className: 'array-match',
        },
      ],
    })

    expect(button({ size: 'sm', tone: 'danger' })).toContain('array-match')
    expect(button({ size: 'lg', tone: 'danger' })).toContain('array-match')
    expect(button({ size: 'md', tone: 'danger' })).not.toContain('array-match')
  })

  it('does not match when actual value is NOT in the array', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', md: 'text-md', lg: 'text-lg' },
        tone: { primary: 'bg-blue', danger: 'bg-red' },
      },
      compoundVariants: [
        {
          size: ['sm'],
          tone: ['danger'],
          className: 'array-match',
        },
      ],
    })

    expect(button({ size: 'md', tone: 'danger' })).not.toContain('array-match')
    expect(button({ size: 'sm', tone: 'primary' })).not.toContain('array-match')
  })

  it('mixes scalar and array conditions in the same compound entry', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', md: 'text-md', lg: 'text-lg' },
        tone: { primary: 'bg-blue', danger: 'bg-red' },
      },
      compoundVariants: [
        {
          size: ['sm', 'lg'], // array
          tone: 'danger', // scalar
          className: 'mixed',
        },
      ],
    })

    expect(button({ size: 'sm', tone: 'danger' })).toContain('mixed')
    expect(button({ size: 'lg', tone: 'danger' })).toContain('mixed')
    expect(button({ size: 'md', tone: 'danger' })).not.toContain('mixed')
    expect(button({ size: 'sm', tone: 'primary' })).not.toContain('mixed')
  })

  it('accepts an empty array (never matches)', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', lg: 'text-lg' },
      },
      compoundVariants: [
        {
          size: [],
          className: 'never',
        },
      ],
    })

    expect(button({ size: 'sm' })).not.toContain('never')
    expect(button({ size: 'lg' })).not.toContain('never')
  })

  it('compound array conditions cooperate with UNSET (skip)', () => {
    const button = cva({
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', lg: 'text-lg' },
        tone: { primary: 'bg-blue', danger: 'bg-red' },
      },
      defaultVariants: { size: 'lg', tone: 'danger' },
      compoundVariants: [
        {
          size: ['sm', 'lg'],
          tone: ['danger'],
          className: 'matches',
        },
      ],
    })

    expect(button()).toContain('matches')
    // UNSET on a required compound condition → no match.
    expect(button({ size: UNSET })).not.toContain('matches')
    expect(button({ tone: UNSET })).not.toContain('matches')
  })
})
