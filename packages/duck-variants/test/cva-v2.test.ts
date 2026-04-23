import { beforeAll, describe, expect, it } from 'vitest'
import { cva } from '../src/variants'

describe('@gentleduck/variants - cva core tests', () => {
  let baseCva: ReturnType<typeof cva>
  let compoundCva: ReturnType<typeof cva>

  beforeAll(() => {
    // variants order: align, justify
    baseCva = cva('flex items-center', {
      defaultVariants: {
        align: 'center',
        justify: 'start',
      },
      variants: {
        align: {
          bottom: 'items-end',
          center: 'items-center',
          top: 'items-start',
        },
        justify: {
          center: 'justify-center',
          end: 'justify-end',
          start: 'justify-start',
        },
      },
    })

    // variants order: size, state
    compoundCva = cva('bg-white', {
      compoundVariants: [
        {
          class: 'ring-4 ring-blue-300',
          size: 'lg',
          state: 'active',
        },
        {
          className: 'opacity-70',
          size: 'sm',
          state: 'inactive',
        },
      ],
      defaultVariants: {
        size: 'sm',
        state: 'inactive',
      },
      variants: {
        size: {
          lg: 'p-4 text-lg',
          sm: 'p-2 text-sm',
        },
        state: {
          active: 'bg-blue-500 text-white',
          inactive: 'bg-gray-300 text-black',
        },
      },
    })
  })

  describe('basic variant behavior', () => {
    it('should apply base classes and default variants', () => {
      // base: "flex items-center", align=center -> "items-center" (deduped), justify=start -> "justify-start"
      const result = baseCva()
      expect(result).toEqual('flex items-center justify-start')
    })

    it('should override default variants with props', () => {
      // base: "flex items-center", align=top -> "items-start", justify=center -> "justify-center"
      // Order: base tokens, then align variant, then justify variant
      const result = baseCva({ align: 'top', justify: 'center' })
      expect(result).toEqual('flex items-center items-start justify-center')
    })

    it('should correctly handle additional className prop', () => {
      // align defaults to center ("items-center" deduped with base), justify=end -> "justify-end", className="gap-4"
      const result = baseCva({ className: 'gap-4', justify: 'end' })
      expect(result).toEqual('flex items-center justify-end gap-4')
    })

    it('should correctly handle additional class prop', () => {
      // base: "flex items-center", align=bottom -> "items-end", justify defaults to start -> "justify-start", class="mt-2"
      const result = baseCva({ align: 'bottom', class: 'mt-2' })
      expect(result).toEqual('flex items-center items-end justify-start mt-2')
    })

    it('should merge class and className together', () => {
      const result = baseCva({
        class: 'mx-2',
        className: 'gap-2',
        justify: 'center',
      })
      expect(result).toEqual('flex items-center justify-center gap-2 mx-2')
    })
  })

  describe('compound variants behavior', () => {
    it('should apply base and default classes without compound', () => {
      // base: "bg-white", size=sm -> "p-2 text-sm", state=inactive -> "bg-gray-300 text-black"
      // compound match: size=sm + state=inactive -> className="opacity-70"
      const result = compoundCva()
      expect(result).toEqual('bg-white p-2 text-sm bg-gray-300 text-black opacity-70')
    })

    it('should apply compound class when matching active + lg', () => {
      // base: "bg-white", size=lg -> "p-4 text-lg", state=active -> "bg-blue-500 text-white"
      // compound match: size=lg + state=active -> class="ring-4 ring-blue-300"
      const result = compoundCva({ size: 'lg', state: 'active' })
      expect(result).toEqual('bg-white p-4 text-lg bg-blue-500 text-white ring-4 ring-blue-300')
    })

    it('should NOT apply compound class if not matching', () => {
      // base: "bg-white", size=sm -> "p-2 text-sm", state=active -> "bg-blue-500 text-white"
      // No compound match (need lg+active or sm+inactive)
      const result = compoundCva({ size: 'sm', state: 'active' })
      expect(result).toEqual('bg-white p-2 text-sm bg-blue-500 text-white')
    })

    it('should apply multiple compound conditions independently', () => {
      // same as defaults: size=sm, state=inactive
      const result = compoundCva({ size: 'sm', state: 'inactive' })
      expect(result).toEqual('bg-white p-2 text-sm bg-gray-300 text-black opacity-70')
    })
  })

  describe('array classes handling', () => {
    const arrayCva = cva('relative', {
      defaultVariants: {
        color: 'blue',
      },
      variants: {
        color: {
          blue: ['bg-blue-500', 'hover:bg-blue-700'],
          red: ['bg-red-500', 'hover:bg-red-700'],
        },
      },
    })

    it('should flatten and merge multiple classes from array', () => {
      const result = arrayCva({ color: 'red' })
      expect(result).toEqual('relative bg-red-500 hover:bg-red-700')
    })

    it('should include default array classes when no props provided', () => {
      const result = arrayCva()
      expect(result).toEqual('relative bg-blue-500 hover:bg-blue-700')
    })
  })

  describe('edge cases', () => {
    it('should gracefully handle empty props', () => {
      const result = baseCva({})
      expect(result).toEqual('flex items-center justify-start')
    })

    it('should ignore unknown props safely', () => {
      const result = baseCva({ unknown: 'something' } as Record<string, unknown>)
      expect(result).toEqual('flex items-center justify-start')
    })

    it('should handle empty class and className', () => {
      const result = baseCva({ class: '', className: '' })
      expect(result).toEqual('flex items-center justify-start')
    })

    it('should avoid duplicating classes when already present', () => {
      const result = cva('text-center', {
        defaultVariants: {
          align: 'center',
        },
        variants: {
          align: {
            center: 'text-center',
          },
        },
      })()
      expect(result).toEqual('text-center')
    })
  })

  describe('caching behavior', () => {
    it('should cache results for identical props', () => {
      const first = baseCva({ align: 'bottom', justify: 'center' })
      const second = baseCva({ align: 'bottom', justify: 'center' })
      expect(first).toStrictEqual(second)
    })

    it('should produce different outputs for different props', () => {
      const first = baseCva({ justify: 'center' })
      const second = baseCva({ justify: 'start' })
      expect(first).not.toEqual(second)
    })
  })

  describe('multiple compound variants matching', () => {
    // variants order: size, variant
    const multiCompound = cva('border', {
      compoundVariants: [
        {
          class: 'shadow-md',
          size: 'md',
          variant: 'outlined',
        },
        {
          className: 'rounded-md',
          size: 'sm',
          variant: 'filled',
        },
      ],
      variants: {
        size: {
          md: 'p-4',
          sm: 'p-2',
        },
        variant: {
          filled: 'bg-gray-200',
          outlined: 'border-2 border-gray-300',
        },
      },
    })

    it('should apply multiple compound classes correctly', () => {
      // base: "border", size=md -> "p-4", variant=outlined -> "border-2 border-gray-300"
      // compound match: size=md + variant=outlined -> class="shadow-md"
      const result = multiCompound({ size: 'md', variant: 'outlined' })
      expect(result).toEqual('border p-4 border-2 border-gray-300 shadow-md')
    })

    it('should apply a different compound class for different combination', () => {
      // base: "border", size=sm -> "p-2", variant=filled -> "bg-gray-200"
      // compound match: size=sm + variant=filled -> className="rounded-md"
      const result = multiCompound({ size: 'sm', variant: 'filled' })
      expect(result).toEqual('border p-2 bg-gray-200 rounded-md')
    })

    it('should fallback to only variant/size if no compound match', () => {
      // base: "border", size=md -> "p-4", variant=filled -> "bg-gray-200"
      // no compound match
      const result = multiCompound({ size: 'md', variant: 'filled' })
      expect(result).toEqual('border p-4 bg-gray-200')
    })
  })

  describe('stress: large variant groups (10+ keys)', () => {
    const largeVariant = cva('lv-root', {
      defaultVariants: {
        a: 'a1', b: 'b1', c: 'c1', d: 'd1', e: 'e1',
        f: 'f1', g: 'g1', h: 'h1', i: 'i1', j: 'j1',
        k: 'k1',
      },
      variants: {
        a: { a1: 'cls-a1', a2: 'cls-a2' },
        b: { b1: 'cls-b1', b2: 'cls-b2' },
        c: { c1: 'cls-c1', c2: 'cls-c2' },
        d: { d1: 'cls-d1', d2: 'cls-d2' },
        e: { e1: 'cls-e1', e2: 'cls-e2' },
        f: { f1: 'cls-f1', f2: 'cls-f2' },
        g: { g1: 'cls-g1', g2: 'cls-g2' },
        h: { h1: 'cls-h1', h2: 'cls-h2' },
        i: { i1: 'cls-i1', i2: 'cls-i2' },
        j: { j1: 'cls-j1', j2: 'cls-j2' },
        k: { k1: 'cls-k1', k2: 'cls-k2' },
      },
    })

    it('should produce correct defaults for 11 variant keys', () => {
      const result = largeVariant()
      expect(result).toEqual(
        'lv-root cls-a1 cls-b1 cls-c1 cls-d1 cls-e1 cls-f1 cls-g1 cls-h1 cls-i1 cls-j1 cls-k1',
      )
    })

    it('should override every variant key in a single call', () => {
      const result = largeVariant({
        a: 'a2', b: 'b2', c: 'c2', d: 'd2', e: 'e2',
        f: 'f2', g: 'g2', h: 'h2', i: 'i2', j: 'j2',
        k: 'k2',
      })
      expect(result).toEqual(
        'lv-root cls-a2 cls-b2 cls-c2 cls-d2 cls-e2 cls-f2 cls-g2 cls-h2 cls-i2 cls-j2 cls-k2',
      )
    })
  })

  describe('stress: deep compound variant combinations', () => {
    const deepCompound = cva('dc-root', {
      compoundVariants: [
        { a: 'x', b: 'y', c: 'z', class: 'triple-xyz' },
        { a: 'x', b: 'y', class: 'double-xy' },
        { b: 'y', c: 'z', className: 'double-yz' },
        { a: 'x', c: 'z', class: 'double-xz' },
        { a: 'x', b: 'y', c: 'z', className: 'triple-xyz-cn' },
      ],
      defaultVariants: { a: 'x', b: 'y', c: 'z' },
      variants: {
        a: { x: 'a-x', w: 'a-w' },
        b: { y: 'b-y', n: 'b-n' },
        c: { z: 'c-z', m: 'c-m' },
      },
    })

    it('should match all 5 overlapping compound variants at once', () => {
      const result = deepCompound()
      expect(result).toContain('triple-xyz')
      expect(result).toContain('double-xy')
      expect(result).toContain('double-yz')
      expect(result).toContain('double-xz')
      expect(result).toContain('triple-xyz-cn')
    })

    it('should match only 2-key compounds when third key differs', () => {
      const result = deepCompound({ a: 'x', b: 'y', c: 'm' })
      expect(result).toContain('double-xy')
      expect(result).not.toContain('triple-xyz')
      expect(result).not.toContain('double-yz')
      expect(result).not.toContain('double-xz')
    })

    it('should match zero compounds when no keys overlap', () => {
      const result = deepCompound({ a: 'w', b: 'n', c: 'm' })
      expect(result).not.toContain('triple')
      expect(result).not.toContain('double')
      expect(result).toEqual('dc-root a-w b-n c-m')
    })
  })

  describe('null/undefined variant values', () => {
    // Note: explicit undefined/null in props overrides the default via spread,
    // so the merged value is null/undefined and the variant is skipped entirely.
    it('should skip variant when explicitly set to undefined (overrides default)', () => {
      const result = baseCva({ align: undefined })
      // align is skipped, justify defaults to start
      expect(result).toEqual('flex items-center justify-start')
    })

    it('should skip variant when explicitly set to null (overrides default)', () => {
      const result = baseCva({ align: null } as unknown as Record<string, unknown>)
      // align is skipped, justify defaults to start
      expect(result).toEqual('flex items-center justify-start')
    })

    it('should return only base when all variants are explicitly undefined', () => {
      const result = baseCva({ align: undefined, justify: undefined })
      // both skipped, only base remains
      expect(result).toEqual('flex items-center')
    })
  })

  describe('ClassDictionary (conditional object) handling', () => {
    // Each test uses a fresh cva instance to avoid cache key collisions.
    // The cache key serializes objects as "[object Object]" so dict-valued
    // className props on the same cva instance would collide.

    it('should include truthy keys and exclude falsy keys in className', () => {
      const fresh = cva('flex items-center', {
        defaultVariants: { align: 'center', justify: 'start' },
        variants: {
          align: { bottom: 'items-end', center: 'items-center', top: 'items-start' },
          justify: { center: 'justify-center', end: 'justify-end', start: 'justify-start' },
        },
      })
      const result = fresh({
        className: { 'active-class': true, 'hidden-class': false, 'another-on': true },
      })
      expect(result).toContain('active-class')
      expect(result).toContain('another-on')
      expect(result).not.toContain('hidden-class')
    })

    it('should include truthy keys and exclude falsy keys in class prop', () => {
      const fresh = cva('flex items-center', {
        defaultVariants: { align: 'center', justify: 'start' },
        variants: {
          align: { bottom: 'items-end', center: 'items-center', top: 'items-start' },
          justify: { center: 'justify-center', end: 'justify-end', start: 'justify-start' },
        },
      })
      const result = fresh({
        class: { 'on-class': true, 'off-class': false },
      })
      expect(result).toContain('on-class')
      expect(result).not.toContain('off-class')
    })

    it('should handle all-false dictionary gracefully', () => {
      const fresh = cva('flex items-center', {
        defaultVariants: { align: 'center', justify: 'start' },
        variants: {
          align: { bottom: 'items-end', center: 'items-center', top: 'items-start' },
          justify: { center: 'justify-center', end: 'justify-end', start: 'justify-start' },
        },
      })
      const result = fresh({
        className: { 'nope-a': false, 'nope-b': false },
      })
      expect(result).toEqual('flex items-center justify-start')
    })

    it('should handle undefined values in dictionary', () => {
      const fresh = cva('flex items-center', {
        defaultVariants: { align: 'center', justify: 'start' },
        variants: {
          align: { bottom: 'items-end', center: 'items-center', top: 'items-start' },
          justify: { center: 'justify-center', end: 'justify-end', start: 'justify-start' },
        },
      })
      const result = fresh({
        className: { 'present': true, 'absent': undefined },
      })
      expect(result).toContain('present')
      expect(result).not.toContain('absent')
    })
  })

  describe('deeply nested array ClassValue', () => {
    it('should flatten 3 levels of nested arrays', () => {
      const result = baseCva({
        className: [[['deep-a', 'deep-b'], 'mid-c'], 'top-d'],
      })
      expect(result).toContain('deep-a')
      expect(result).toContain('deep-b')
      expect(result).toContain('mid-c')
      expect(result).toContain('top-d')
    })

    it('should handle mixed nested types: strings, arrays, dicts', () => {
      const result = baseCva({
        className: [
          'flat-str',
          ['nested-str', { 'dict-true': true, 'dict-false': false }],
          [['very-deep']],
        ],
      })
      expect(result).toContain('flat-str')
      expect(result).toContain('nested-str')
      expect(result).toContain('dict-true')
      expect(result).not.toContain('dict-false')
      expect(result).toContain('very-deep')
    })
  })

  describe('numeric ClassValue', () => {
    it('should convert a number in className to its string representation', () => {
      const result = baseCva({ className: 99 as unknown as string })
      expect(result).toContain('99')
    })

    it('should handle number inside a nested array', () => {
      const result = baseCva({
        className: ['str-class', 100 as unknown as string],
      })
      expect(result).toContain('str-class')
      expect(result).toContain('100')
    })
  })

  describe('empty string variant values', () => {
    const emptyVarCva = cva('ev-root', {
      defaultVariants: { state: 'idle' },
      variants: {
        state: {
          active: 'state-active',
          idle: '',
        },
      },
    })

    it('should produce only base when default variant maps to empty string', () => {
      expect(emptyVarCva()).toEqual('ev-root')
    })

    it('should apply non-empty variant correctly', () => {
      expect(emptyVarCva({ state: 'active' })).toEqual('ev-root state-active')
    })
  })

  describe('class deduplication stress', () => {
    it('should deduplicate tokens shared between base, variants, compounds, and props', () => {
      const dedupCva = cva('shared-token unique-base', {
        compoundVariants: [
          { v: 'a', class: 'shared-token compound-only' },
        ],
        defaultVariants: { v: 'a' },
        variants: { v: { a: 'shared-token variant-only' } },
      })
      const result = dedupCva({ className: 'shared-token props-only' })
      // shared-token should appear only once
      const tokens = result.split(' ')
      const sharedCount = tokens.filter((t: string) => t === 'shared-token').length
      expect(sharedCount).toEqual(1)
      expect(result).toContain('unique-base')
      expect(result).toContain('variant-only')
      expect(result).toContain('compound-only')
      expect(result).toContain('props-only')
    })

    it('should deduplicate when class and className both provide the same token', () => {
      const result = baseCva({ class: 'dup-token extra-a', className: 'dup-token extra-b' })
      const tokens = result.split(' ')
      const dupCount = tokens.filter((t: string) => t === 'dup-token').length
      expect(dupCount).toEqual(1)
      expect(result).toContain('extra-a')
      expect(result).toContain('extra-b')
    })
  })

  describe('performance: 10000 calls', () => {
    it('should handle 10000 varied invocations in under 500ms', () => {
      const alignOptions = ['center', 'top', 'bottom'] as const
      const justifyOptions = ['start', 'center', 'end'] as const
      const start = performance.now()
      for (let i = 0; i < 10000; i++) {
        baseCva({
          align: alignOptions[i % 3],
          justify: justifyOptions[i % 3],
        })
      }
      const elapsed = performance.now() - start
      expect(elapsed).toBeLessThan(500)
    })

    it('should handle 10000 cached calls near-instantly', () => {
      // Warm up
      baseCva({ align: 'top', justify: 'end' })

      const start = performance.now()
      for (let i = 0; i < 10000; i++) {
        baseCva({ align: 'top', justify: 'end' })
      }
      const elapsed = performance.now() - start
      expect(elapsed).toBeLessThan(100)
    })
  })

  describe('no variants / no defaultVariants', () => {
    it('should return only base when variants object is empty', () => {
      const baseOnly = cva('just-base', { variants: {} as Record<string, never> })
      expect(baseOnly()).toEqual('just-base')
    })

    it('should return only base with className when no variants defined', () => {
      const baseOnly = cva('just-base', { variants: {} as Record<string, never> })
      expect(baseOnly({ className: 'extra' })).toEqual('just-base extra')
    })

    it('should work with variants but no defaultVariants provided', () => {
      const noDef = cva('nd-root', {
        variants: { tone: { loud: 'tone-loud', quiet: 'tone-quiet' } },
      })
      expect(noDef()).toEqual('nd-root')
      expect(noDef({ tone: 'loud' })).toEqual('nd-root tone-loud')
    })

    it('should return empty string when base is empty and no variants match', () => {
      const empty = cva('', {
        variants: { v: { a: 'v-a' } },
      })
      expect(empty()).toEqual('')
    })
  })

  describe('single-argument call signature', () => {
    it('should accept an options object with base property', () => {
      const singleArg = cva({
        base: 'sa-base',
        defaultVariants: { mode: 'light' },
        variants: {
          mode: { light: 'sa-light', dark: 'sa-dark' },
        },
      })
      expect(singleArg()).toEqual('sa-base sa-light')
      expect(singleArg({ mode: 'dark' })).toEqual('sa-base sa-dark')
    })

    it('should work with compound variants in single-arg form', () => {
      const singleArg = cva({
        base: 'sa-compound',
        compoundVariants: [
          { a: 'x', b: 'y', class: 'sa-hit' },
        ],
        defaultVariants: { a: 'x', b: 'y' },
        variants: {
          a: { x: 'a-x', w: 'a-w' },
          b: { y: 'b-y', n: 'b-n' },
        },
      })
      expect(singleArg()).toContain('sa-hit')
      expect(singleArg({ a: 'w' })).not.toContain('sa-hit')
    })

    it('should default base to empty string when omitted', () => {
      const noBase = cva({
        defaultVariants: { v: 'a' },
        variants: { v: { a: 'only-v' } },
      })
      expect(noBase()).toEqual('only-v')
    })
  })

  describe('compound variants with array conditions', () => {
    const arrayCond = cva('acv-root', {
      compoundVariants: [
        {
          color: ['red', 'blue'],
          size: 'lg',
          className: 'array-match',
        },
      ],
      defaultVariants: { color: 'red', size: 'sm' },
      variants: {
        color: { red: 'acv-red', blue: 'acv-blue', green: 'acv-green' },
        size: { sm: 'acv-sm', lg: 'acv-lg' },
      },
    })

    it('should match when value is first element of array condition', () => {
      expect(arrayCond({ color: 'red', size: 'lg' })).toContain('array-match')
    })

    it('should match when value is second element of array condition', () => {
      expect(arrayCond({ color: 'blue', size: 'lg' })).toContain('array-match')
    })

    it('should NOT match when value is not in array condition', () => {
      expect(arrayCond({ color: 'green', size: 'lg' })).not.toContain('array-match')
    })

    it('should NOT match when non-array key does not match', () => {
      expect(arrayCond({ color: 'red', size: 'sm' })).not.toContain('array-match')
    })
  })

  describe('unset variant behavior', () => {
    it('should skip variant when value is "unset"', () => {
      const result = baseCva({ align: 'unset' as 'center' })
      expect(result).not.toContain('items-start')
      expect(result).not.toContain('items-end')
      // base already has items-center but the variant for center won't be re-applied
      expect(result).toContain('flex')
    })
  })

  describe('whitespace handling in class strings', () => {
    it('should handle variant values with extra whitespace', () => {
      const spacey = cva('spacey-base', {
        defaultVariants: { v: 'a' },
        variants: { v: { a: 'spacey-a extra-space' } },
      })
      const result = spacey()
      expect(result).not.toMatch(/^\s/)
      expect(result).not.toMatch(/\s$/)
      expect(result).toContain('spacey-base')
      expect(result).toContain('spacey-a')
      expect(result).toContain('extra-space')
    })

    it('should handle className with leading/trailing spaces', () => {
      const result = baseCva({ className: '  padded-class  ' })
      expect(result).toContain('padded-class')
      expect(result).not.toMatch(/^\s/)
    })
  })

  describe('compound variants with both class and className', () => {
    const dualCompound = cva('dual-root', {
      compoundVariants: [
        {
          v: 'a',
          class: 'from-class',
          className: 'from-className',
        },
      ],
      defaultVariants: { v: 'a' },
      variants: { v: { a: 'v-a', b: 'v-b' } },
    })

    it('should apply both class and className from a single compound variant', () => {
      const result = dualCompound()
      expect(result).toContain('from-class')
      expect(result).toContain('from-className')
    })

    it('should not apply either when compound does not match', () => {
      const result = dualCompound({ v: 'b' })
      expect(result).not.toContain('from-class')
      expect(result).not.toContain('from-className')
    })
  })
})
