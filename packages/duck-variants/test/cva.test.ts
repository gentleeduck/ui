import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { cva } from '../src/variants'

// ! NOTE: NEEDS REVIEW , RC REMOVE
describe.skip('@gentleduck/variants - cva', () => {
  let button: ReturnType<typeof cva>
  let badge: ReturnType<typeof cva>
  let card: ReturnType<typeof cva>
  let alert: ReturnType<typeof cva>

  beforeAll(() => {
    button = cva('btn', {
      variants: {
        size: {
          sm: 'btn-sm',
          lg: 'btn-lg',
        },
        color: {
          primary: 'btn-primary',
          secondary: 'btn-secondary',
        },
      },
      defaultVariants: {
        size: 'sm',
        color: 'primary',
      },
    })

    badge = cva('badge', {
      variants: {
        size: {
          sm: ['badge-sm', 'text-xs'],
          lg: ['badge-lg', 'text-lg'],
        },
        color: {
          primary: ['bg-blue-500', 'text-white'],
          secondary: ['bg-gray-200', 'text-gray-800'],
        },
      },
      defaultVariants: {
        size: 'sm',
        color: 'primary',
      },
    })

    card = cva('card', {
      variants: {
        size: {
          small: 'card-sm',
          large: 'card-lg',
        },
        color: {
          primary: 'card-primary',
          secondary: 'card-secondary',
        },
      },
      compoundVariants: [
        {
          size: 'large',
          color: 'primary',
          class: 'card-large-primary',
        },
        {
          size: 'small',
          color: 'secondary',
          className: 'card-small-secondary',
        },
      ],
      defaultVariants: {
        size: 'small',
        color: 'primary',
      },
    })

    alert = cva('alert', {
      variants: {
        severity: {
          info: 'alert-info',
          error: 'alert-error',
        },
      },
      defaultVariants: {
        severity: 'info',
      },
    })
  })

  afterAll(() => {
    // No global teardown needed yet
  })

  describe('#cva - Basic Variant Behavior', () => {
    it('should generate default classes correctly when no props passed', () => {
      const result = button()
      expect(result).toEqual('btn btn-sm btn-primary')
    })

    it('should override default variants with provided props', () => {
      const result = button({ size: 'lg', color: 'secondary' })
      expect(result).toEqual('btn btn-lg btn-secondary')
    })

    it('should accept and merge additional classes via className', () => {
      const result = button({ size: 'lg', className: 'extra-class' })
      expect(result).toEqual('btn btn-lg btn-primary extra-class')
    })

    it('should accept and merge additional classes via class', () => {
      const result = button({ size: 'lg', class: 'another-extra' })
      expect(result).toEqual('btn btn-lg btn-primary another-extra')
    })

    it('should correctly merge both class and className props', () => {
      const result = button({ className: 'foo', class: 'bar' })
      expect(result).toEqual('btn btn-sm btn-primary foo bar')
    })
  })

  describe('#cva - Multiple classes from array values', () => {
    it('should correctly add multiple classes from an array for a variant', () => {
      const result = badge({ size: 'lg', color: 'secondary' })
      expect(result).toEqual('badge badge-lg text-lg bg-gray-200 text-gray-800')
    })
  })

  describe('#cva - Compound Variants', () => {
    it('should apply compound variant classes when conditions match (class)', () => {
      const result = card({ size: 'large', color: 'primary' })
      expect(result).toEqual('card card-lg card-primary card-large-primary')
    })

    it('should apply compound variant classes when conditions match (className)', () => {
      const result = card({ size: 'small', color: 'secondary' })
      expect(result).toEqual('card card-sm card-secondary card-small-secondary')
    })

    it('should NOT apply compound variant classes if conditions do not match', () => {
      const result = card({ size: 'large', color: 'secondary' })
      expect(result).toEqual('card card-lg card-secondary')
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
      const firstCall = button({ size: 'lg', color: 'secondary' })
      const secondCall = button({ size: 'lg', color: 'secondary' })

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
      const result = button({ className: '', class: '' })
      expect(result).toEqual('btn btn-sm btn-primary')
    })

    it('should handle multiple additional classes provided as arrays', () => {
      const customBadge = badge({
        size: 'lg',
        color: 'primary',
        className: ['hover:bg-blue-600', 'focus:ring-2'],
      })
      expect(customBadge).toEqual('badge badge-lg text-lg bg-blue-500 text-white hover:bg-blue-600 focus:ring-2')
    })

    it('should ignore unknown props not defined in variants', () => {
      const result = button({
        size: 'lg',
        color: 'primary',
        unknownProp: 'value',
      } as any)
      expect(result).toEqual('btn btn-lg btn-primary')
    })
  })
})
