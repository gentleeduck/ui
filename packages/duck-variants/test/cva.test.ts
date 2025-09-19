import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { cva } from '../src/variants'

// ! NOTE: NEEDS REVIEW , RC REMOVE
describe.skip('@gentleduck/variants - cva', () => {
  let button: ReturnType<typeof cva>
  let badge: ReturnType<typeof cva>
  let card: ReturnType<typeof cva>
  let alert: ReturnType<typeof cva>

  beforeAll(() => {
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
      const result = button()
      expect(result).toEqual('btn btn-sm btn-primary')
    })

    it('should override default variants with provided props', () => {
      const result = button({ color: 'secondary', size: 'lg' })
      expect(result).toEqual('btn btn-lg btn-secondary')
    })

    it('should accept and merge additional classes via className', () => {
      const result = button({ className: 'extra-class', size: 'lg' })
      expect(result).toEqual('btn btn-lg btn-primary extra-class')
    })

    it('should accept and merge additional classes via class', () => {
      const result = button({ class: 'another-extra', size: 'lg' })
      expect(result).toEqual('btn btn-lg btn-primary another-extra')
    })

    it('should correctly merge both class and className props', () => {
      const result = button({ class: 'bar', className: 'foo' })
      expect(result).toEqual('btn btn-sm btn-primary foo bar')
    })
  })

  describe('#cva - Multiple classes from array values', () => {
    it('should correctly add multiple classes from an array for a variant', () => {
      const result = badge({ color: 'secondary', size: 'lg' })
      expect(result).toEqual('badge badge-lg text-lg bg-gray-200 text-gray-800')
    })
  })

  describe('#cva - Compound Variants', () => {
    it('should apply compound variant classes when conditions match (class)', () => {
      const result = card({ color: 'primary', size: 'large' })
      expect(result).toEqual('card card-lg card-primary card-large-primary')
    })

    it('should apply compound variant classes when conditions match (className)', () => {
      const result = card({ color: 'secondary', size: 'small' })
      expect(result).toEqual('card card-sm card-secondary card-small-secondary')
    })

    it('should NOT apply compound variant classes if conditions do not match', () => {
      const result = card({ color: 'secondary', size: 'large' })
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
      expect(result).toEqual('btn btn-sm btn-primary')
    })

    it('should handle multiple additional classes provided as arrays', () => {
      const customBadge = badge({
        className: ['hover:bg-blue-600', 'focus:ring-2'],
        color: 'primary',
        size: 'lg',
      })
      expect(customBadge).toEqual('badge badge-lg text-lg bg-blue-500 text-white hover:bg-blue-600 focus:ring-2')
    })

    it('should ignore unknown props not defined in variants', () => {
      const result = button({
        color: 'primary',
        size: 'lg',
        unknownProp: 'value',
      } as any)
      expect(result).toEqual('btn btn-lg btn-primary')
    })
  })
})
