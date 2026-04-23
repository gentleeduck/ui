import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { cva } from '../src/variants'

describe('@gentleduck/variants - cva', () => {
  let button: ReturnType<typeof cva>
  let badge: ReturnType<typeof cva>
  let card: ReturnType<typeof cva>
  let alert: ReturnType<typeof cva>

  beforeAll(() => {
    // variants order: color, size
    button = cva('btn', {
      defaultVariants: {
        color: 'primary',
        size: 'sm',
      },
      variants: {
        color: {
          primary: 'btn-primary',
          secondary: 'btn-secondary',
        },
        size: {
          lg: 'btn-lg',
          sm: 'btn-sm',
        },
      },
    })

    // variants order: color, size
    badge = cva('badge', {
      defaultVariants: {
        color: 'primary',
        size: 'sm',
      },
      variants: {
        color: {
          primary: ['bg-blue-500', 'text-white'],
          secondary: ['bg-gray-200', 'text-gray-800'],
        },
        size: {
          lg: ['badge-lg', 'text-lg'],
          sm: ['badge-sm', 'text-xs'],
        },
      },
    })

    // variants order: color, size
    card = cva('card', {
      compoundVariants: [
        {
          class: 'card-large-primary',
          color: 'primary',
          size: 'large',
        },
        {
          className: 'card-small-secondary',
          color: 'secondary',
          size: 'small',
        },
      ],
      defaultVariants: {
        color: 'primary',
        size: 'small',
      },
      variants: {
        color: {
          primary: 'card-primary',
          secondary: 'card-secondary',
        },
        size: {
          large: 'card-lg',
          small: 'card-sm',
        },
      },
    })

    alert = cva('alert', {
      defaultVariants: {
        severity: 'info',
      },
      variants: {
        severity: {
          error: 'alert-error',
          info: 'alert-info',
        },
      },
    })
  })

  afterAll(() => {
    // No global teardown needed yet
  })

  describe('#cva - Basic Variant Behavior', () => {
    it('should generate default classes correctly when no props passed', () => {
      // base: "btn", color=primary -> "btn-primary", size=sm -> "btn-sm"
      const result = button()
      expect(result).toEqual('btn btn-primary btn-sm')
    })

    it('should override default variants with provided props', () => {
      // base: "btn", color=secondary -> "btn-secondary", size=lg -> "btn-lg"
      const result = button({ color: 'secondary', size: 'lg' })
      expect(result).toEqual('btn btn-secondary btn-lg')
    })

    it('should accept and merge additional classes via className', () => {
      // base: "btn", color defaults to primary -> "btn-primary", size=lg -> "btn-lg", className="extra-class"
      const result = button({ className: 'extra-class', size: 'lg' })
      expect(result).toEqual('btn btn-primary btn-lg extra-class')
    })

    it('should accept and merge additional classes via class', () => {
      // base: "btn", color defaults to primary -> "btn-primary", size=lg -> "btn-lg", class="another-extra"
      const result = button({ class: 'another-extra', size: 'lg' })
      expect(result).toEqual('btn btn-primary btn-lg another-extra')
    })

    it('should correctly merge both class and className props', () => {
      // base: "btn", color=primary -> "btn-primary", size=sm -> "btn-sm", className="foo", class="bar"
      const result = button({ class: 'bar', className: 'foo' })
      expect(result).toEqual('btn btn-primary btn-sm foo bar')
    })
  })

  describe('#cva - Multiple classes from array values', () => {
    it('should correctly add multiple classes from an array for a variant', () => {
      // base: "badge", color=secondary -> ["bg-gray-200","text-gray-800"], size=lg -> ["badge-lg","text-lg"]
      const result = badge({ color: 'secondary', size: 'lg' })
      expect(result).toEqual('badge bg-gray-200 text-gray-800 badge-lg text-lg')
    })
  })

  describe('#cva - Compound Variants', () => {
    it('should apply compound variant classes when conditions match (class)', () => {
      // base: "card", color=primary -> "card-primary", size=large -> "card-lg"
      // compound: color=primary + size=large -> class="card-large-primary"
      const result = card({ color: 'primary', size: 'large' })
      expect(result).toEqual('card card-primary card-lg card-large-primary')
    })

    it('should apply compound variant classes when conditions match (className)', () => {
      // base: "card", color=secondary -> "card-secondary", size=small -> "card-sm"
      // compound: color=secondary + size=small -> className="card-small-secondary"
      const result = card({ color: 'secondary', size: 'small' })
      expect(result).toEqual('card card-secondary card-sm card-small-secondary')
    })

    it('should NOT apply compound variant classes if conditions do not match', () => {
      // base: "card", color=secondary -> "card-secondary", size=large -> "card-lg"
      // no compound match
      const result = card({ color: 'secondary', size: 'large' })
      expect(result).toEqual('card card-secondary card-lg')
    })
  })

  describe('#cva - Type Safety', () => {
    it('should only accept valid variant values (compile-time enforced)', () => {
      const result = alert({ severity: 'error' })
      expect(result).toEqual('alert alert-error')
    })

    it('should use default variant if no severity provided', () => {
      const result = alert()
      expect(result).toEqual('alert alert-info')
    })
  })

  describe('#cva - Caching Behavior', () => {
    it('should cache results for the same props object', () => {
      const firstCall = button({ color: 'secondary', size: 'lg' })
      const secondCall = button({ color: 'secondary', size: 'lg' })

      expect(firstCall).toStrictEqual(secondCall)
    })

    it('should not reuse cache across different props', () => {
      const firstCall = button({ size: 'sm' })
      const secondCall = button({ size: 'lg' })

      expect(firstCall).not.toEqual(secondCall)
    })
  })

  describe('#cva - Edge Cases', () => {
    it('should handle empty className and class props gracefully', () => {
      const result = button({ class: '', className: '' })
      expect(result).toEqual('btn btn-primary btn-sm')
    })

    it('should handle multiple additional classes provided as arrays', () => {
      // base: "badge", color=primary -> ["bg-blue-500","text-white"], size=lg -> ["badge-lg","text-lg"]
      // className=["hover:bg-blue-600","focus:ring-2"]
      const customBadge = badge({
        className: ['hover:bg-blue-600', 'focus:ring-2'],
        color: 'primary',
        size: 'lg',
      })
      expect(customBadge).toEqual('badge bg-blue-500 text-white badge-lg text-lg hover:bg-blue-600 focus:ring-2')
    })

    it('should ignore unknown props not defined in variants', () => {
      const result = button({
        color: 'primary',
        size: 'lg',
        unknownProp: 'value',
      } as Record<string, unknown>)
      expect(result).toEqual('btn btn-primary btn-lg')
    })
  })

  describe('#cva - Large Variant Groups (10+ variant keys)', () => {
    const megaComponent = cva('mega-base', {
      defaultVariants: {
        align: 'left',
        border: 'none',
        color: 'red',
        display: 'block',
        font: 'sans',
        gap: 'sm',
        height: 'auto',
        intent: 'default',
        justify: 'start',
        kind: 'primary',
        layout: 'flex',
        mode: 'light',
      },
      variants: {
        align: { center: 'align-center', left: 'align-left', right: 'align-right' },
        border: { none: 'border-none', solid: 'border-solid', dashed: 'border-dashed' },
        color: { red: 'color-red', blue: 'color-blue', green: 'color-green' },
        display: { block: 'display-block', inline: 'display-inline', flex: 'display-flex' },
        font: { sans: 'font-sans', serif: 'font-serif', mono: 'font-mono' },
        gap: { sm: 'gap-sm', md: 'gap-md', lg: 'gap-lg' },
        height: { auto: 'height-auto', full: 'height-full', screen: 'height-screen' },
        intent: { default: 'intent-default', primary: 'intent-primary', danger: 'intent-danger' },
        justify: { start: 'justify-start', center: 'justify-center', end: 'justify-end' },
        kind: { primary: 'kind-primary', secondary: 'kind-secondary', tertiary: 'kind-tertiary' },
        layout: { flex: 'layout-flex', grid: 'layout-grid', absolute: 'layout-absolute' },
        mode: { light: 'mode-light', dark: 'mode-dark' },
      },
    })

    it('should apply all 12 default variants correctly', () => {
      const result = megaComponent()
      expect(result).toEqual(
        'mega-base align-left border-none color-red display-block font-sans gap-sm height-auto intent-default justify-start kind-primary layout-flex mode-light',
      )
    })

    it('should override a subset of the 12 variants', () => {
      const result = megaComponent({
        color: 'blue',
        font: 'mono',
        mode: 'dark',
      })
      expect(result).toContain('color-blue')
      expect(result).toContain('font-mono')
      expect(result).toContain('mode-dark')
      expect(result).toContain('align-left')
      expect(result).not.toContain('color-red')
    })

    it('should override all 12 variants at once', () => {
      const result = megaComponent({
        align: 'right',
        border: 'dashed',
        color: 'green',
        display: 'inline',
        font: 'serif',
        gap: 'lg',
        height: 'screen',
        intent: 'danger',
        justify: 'end',
        kind: 'tertiary',
        layout: 'grid',
        mode: 'dark',
      })
      expect(result).toEqual(
        'mega-base align-right border-dashed color-green display-inline font-serif gap-lg height-screen intent-danger justify-end kind-tertiary layout-grid mode-dark',
      )
    })
  })

  describe('#cva - Deep Compound Variant Combinations', () => {
    const deepCompound = cva('deep-base', {
      compoundVariants: [
        { color: 'red', size: 'lg', variant: 'filled', class: 'compound-red-lg-filled' },
        { color: 'blue', size: 'sm', variant: 'outlined', className: 'compound-blue-sm-outlined' },
        { color: 'red', size: 'sm', class: 'compound-red-sm' },
        { size: 'lg', variant: 'filled', class: 'compound-lg-filled' },
      ],
      defaultVariants: {
        color: 'red',
        size: 'sm',
        variant: 'filled',
      },
      variants: {
        color: { red: 'c-red', blue: 'c-blue' },
        size: { sm: 'sz-sm', lg: 'sz-lg' },
        variant: { filled: 'v-filled', outlined: 'v-outlined' },
      },
    })

    it('should match a 3-key compound variant', () => {
      const result = deepCompound({ color: 'red', size: 'lg', variant: 'filled' })
      expect(result).toContain('compound-red-lg-filled')
      expect(result).toContain('compound-lg-filled')
    })

    it('should match a 2-key compound when all keys present match', () => {
      const result = deepCompound({ color: 'red', size: 'sm', variant: 'filled' })
      expect(result).toContain('compound-red-sm')
    })

    it('should match multiple overlapping compound variants simultaneously', () => {
      const result = deepCompound({ color: 'red', size: 'lg', variant: 'filled' })
      expect(result).toContain('compound-red-lg-filled')
      expect(result).toContain('compound-lg-filled')
    })

    it('should not match 3-key compound when one key differs', () => {
      const result = deepCompound({ color: 'blue', size: 'lg', variant: 'filled' })
      expect(result).not.toContain('compound-red-lg-filled')
      expect(result).toContain('compound-lg-filled')
    })
  })

  describe('#cva - Null and Undefined Variant Values', () => {
    // Note: explicit undefined/null in props overrides the default via spread,
    // so the merged value is null/undefined and the variant is skipped entirely.
    it('should skip variant when value is explicitly undefined (overrides default)', () => {
      const result = button({ color: undefined })
      // color is skipped (undefined overrides default in spread), size defaults to sm
      expect(result).toEqual('btn btn-sm')
    })

    it('should skip variant when value is explicitly null (overrides default)', () => {
      const result = button({ color: null } as unknown as Record<string, unknown>)
      expect(result).toEqual('btn btn-sm')
    })

    it('should return only base when all variants are explicitly undefined', () => {
      const result = button({ color: undefined, size: undefined })
      expect(result).toEqual('btn')
    })
  })

  describe('#cva - Boolean and Numeric ClassValue Handling', () => {
    it('should handle boolean true in className (class dictionary)', () => {
      const result = button({
        className: { 'conditional-class': true, 'excluded-class': false },
      })
      expect(result).toContain('conditional-class')
      expect(result).not.toContain('excluded-class')
    })

    it('should handle number as className', () => {
      const result = button({ className: 42 as unknown as string })
      expect(result).toContain('42')
    })

    it('should handle nested arrays in className', () => {
      const result = button({
        className: [['deeply', ['nested', 'classes']], 'top-level'],
      })
      expect(result).toContain('deeply')
      expect(result).toContain('nested')
      expect(result).toContain('classes')
      expect(result).toContain('top-level')
    })

    it('should handle mixed ClassValue types in className array', () => {
      const result = button({
        className: [
          'string-class',
          { 'dict-on': true, 'dict-off': false },
          ['nested-array-class'],
        ],
      })
      expect(result).toContain('string-class')
      expect(result).toContain('dict-on')
      expect(result).not.toContain('dict-off')
      expect(result).toContain('nested-array-class')
    })
  })

  describe('#cva - Empty String Classes in Variants', () => {
    const emptyVariant = cva('base-class', {
      defaultVariants: { status: 'none' },
      variants: {
        status: {
          active: 'is-active',
          none: '',
        },
      },
    })

    it('should handle empty string variant value gracefully', () => {
      const result = emptyVariant()
      expect(result).toEqual('base-class')
    })

    it('should apply non-empty variant after empty default', () => {
      const result = emptyVariant({ status: 'active' })
      expect(result).toEqual('base-class is-active')
    })
  })

  describe('#cva - Class Deduplication Edge Cases', () => {
    it('should deduplicate when base, variant, and className all share a token', () => {
      const dup = cva('shared-class extra', {
        defaultVariants: { v: 'a' },
        variants: { v: { a: 'shared-class another' } },
      })
      const result = dup({ className: 'shared-class final' })
      expect(result).toEqual('shared-class extra another final')
    })

    it('should deduplicate across base, variant, compound, and className', () => {
      const dup = cva('token-a token-b', {
        compoundVariants: [
          { v: 'x', class: 'token-a token-c' },
        ],
        defaultVariants: { v: 'x' },
        variants: { v: { x: 'token-b token-d' } },
      })
      const result = dup({ className: 'token-c token-e' })
      expect(result).toEqual('token-a token-b token-d token-c token-e')
    })

    it('should deduplicate when class and className both have the same token', () => {
      const result = button({ class: 'dup-token', className: 'dup-token' })
      expect(result).toEqual('btn btn-primary btn-sm dup-token')
    })
  })

  describe('#cva - Performance Stress Test', () => {
    it('should handle 10000 invocations in under 500ms', () => {
      const perf = cva('perf-base', {
        compoundVariants: [
          { color: 'a', size: 'x', class: 'compound-hit' },
        ],
        defaultVariants: { color: 'a', size: 'x' },
        variants: {
          color: { a: 'color-a', b: 'color-b', c: 'color-c' },
          size: { x: 'size-x', y: 'size-y', z: 'size-z' },
        },
      })

      const start = performance.now()
      for (let i = 0; i < 10000; i++) {
        perf({ color: i % 2 === 0 ? 'a' : 'b', size: i % 3 === 0 ? 'x' : 'y' })
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(500)
    })

    it('should benefit from caching on repeated identical calls', () => {
      const perf = cva('cached-base', {
        defaultVariants: { v: 'a' },
        variants: { v: { a: 'v-a', b: 'v-b' } },
      })

      // Warm up cache
      perf({ v: 'a' })
      perf({ v: 'b' })

      const start = performance.now()
      for (let i = 0; i < 10000; i++) {
        perf({ v: 'a' })
      }
      const cachedElapsed = performance.now() - start

      expect(cachedElapsed).toBeLessThan(200)
    })
  })

  describe('#cva - No Variants / No Default Variants', () => {
    it('should work with no variants at all', () => {
      const minimal = cva('only-base', {} as { variants: Record<string, never> })
      expect(minimal()).toEqual('only-base')
    })

    it('should work with variants but no defaultVariants', () => {
      const noDefaults = cva('nd-base', {
        variants: {
          color: { red: 'nd-red', blue: 'nd-blue' },
        },
      })
      // No default, no override -> only base
      expect(noDefaults()).toEqual('nd-base')
      expect(noDefaults({ color: 'red' })).toEqual('nd-base nd-red')
    })

    it('should work with empty base string', () => {
      const emptyBase = cva('', {
        defaultVariants: { v: 'a' },
        variants: { v: { a: 'just-variant' } },
      })
      expect(emptyBase()).toEqual('just-variant')
    })
  })

  describe('#cva - Single-Argument Call Signature', () => {
    it('should accept options object with base property', () => {
      const singleArg = cva({
        base: 'single-arg-base',
        defaultVariants: { size: 'sm' },
        variants: {
          size: { sm: 'sa-sm', lg: 'sa-lg' },
        },
      })
      expect(singleArg()).toEqual('single-arg-base sa-sm')
      expect(singleArg({ size: 'lg' })).toEqual('single-arg-base sa-lg')
    })

    it('should default base to empty string in single-arg form', () => {
      const noBase = cva({
        defaultVariants: { v: 'x' },
        variants: { v: { x: 'v-x' } },
      })
      expect(noBase()).toEqual('v-x')
    })
  })

  describe('#cva - Compound Variants with Array Conditions', () => {
    const arrayCondition = cva('ac-base', {
      compoundVariants: [
        {
          color: ['red', 'blue'],
          size: 'lg',
          class: 'array-compound-hit',
        },
      ],
      defaultVariants: { color: 'red', size: 'sm' },
      variants: {
        color: { red: 'ac-red', blue: 'ac-blue', green: 'ac-green' },
        size: { sm: 'ac-sm', lg: 'ac-lg' },
      },
    })

    it('should match compound when value is in the array condition', () => {
      const result = arrayCondition({ color: 'red', size: 'lg' })
      expect(result).toContain('array-compound-hit')
    })

    it('should match compound for second value in array condition', () => {
      const result = arrayCondition({ color: 'blue', size: 'lg' })
      expect(result).toContain('array-compound-hit')
    })

    it('should NOT match compound when value is outside the array condition', () => {
      const result = arrayCondition({ color: 'green', size: 'lg' })
      expect(result).not.toContain('array-compound-hit')
    })
  })

  describe('#cva - Unset Variant Behavior', () => {
    it('should skip variant classes when value is "unset"', () => {
      const result = button({ color: 'unset' as 'primary' | 'secondary' })
      expect(result).not.toContain('btn-primary')
      expect(result).not.toContain('btn-secondary')
      expect(result).toContain('btn')
      expect(result).toContain('btn-sm')
    })
  })
})
