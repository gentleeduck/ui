import { describe, expect, it } from 'vitest'
import { cva } from '~/variants'

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

    expect(button({ size: 'lg' })).not.toContain('font-bold')
  })
})
