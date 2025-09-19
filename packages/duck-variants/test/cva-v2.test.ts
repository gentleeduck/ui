import { beforeAll, describe, expect, it } from 'vitest'
import { cva } from '../src/variants'

describe('@gentleduck/variants - cva core tests', () => {
  let baseCva: ReturnType<typeof cva>
  let compoundCva: ReturnType<typeof cva>

  beforeAll(() => {
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
      const result = baseCva()
      expect(result).toEqual('flex items-center justify-start')
    })

    it('should override default variants with props', () => {
      const result = baseCva({ align: 'top', justify: 'center' })
      expect(result).toEqual('flex items-center justify-center items-start')
    })

    it('should correctly handle additional className prop', () => {
      const result = baseCva({ className: 'gap-4', justify: 'end' })
      expect(result).toEqual('flex items-center justify-end gap-4')
    })

    it('should correctly handle additional class prop', () => {
      const result = baseCva({ align: 'bottom', class: 'mt-2' })
      expect(result).toEqual('flex items-center justify-start items-end mt-2')
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
      const result = compoundCva()
      expect(result).toEqual('bg-white bg-gray-300 text-black p-2 text-sm opacity-70')
    })

    it('should apply compound class when matching active + lg', () => {
      const result = compoundCva({ size: 'lg', state: 'active' })
      expect(result).toEqual('bg-white bg-blue-500 text-white p-4 text-lg ring-4 ring-blue-300')
    })

    it('should NOT apply compound class if not matching', () => {
      const result = compoundCva({ size: 'sm', state: 'active' })
      expect(result).toEqual('bg-white bg-blue-500 text-white p-2 text-sm')
    })

    it('should apply multiple compound conditions independently', () => {
      const result = compoundCva({ size: 'sm', state: 'inactive' })
      expect(result).toEqual('bg-white bg-gray-300 text-black p-2 text-sm opacity-70')
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
      const result = baseCva({ unknown: 'something' } as any)
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
      const result = multiCompound({ size: 'md', variant: 'outlined' })
      expect(result).toEqual('border border-2 border-gray-300 p-4 shadow-md')
    })

    it('should apply a different compound class for different combination', () => {
      const result = multiCompound({ size: 'sm', variant: 'filled' })
      expect(result).toEqual('border bg-gray-200 p-2 rounded-md')
    })

    it('should fallback to only variant/size if no compound match', () => {
      const result = multiCompound({ size: 'md', variant: 'filled' })
      expect(result).toEqual('border bg-gray-200 p-4')
    })
  })
})
