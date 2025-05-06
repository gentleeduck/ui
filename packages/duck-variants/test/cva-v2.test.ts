import { describe, it, expect, beforeAll } from 'vitest'
import { cva } from '../src/variants'

describe('@gentleduck/variants - cva core tests', () => {
  let baseCva: ReturnType<typeof cva>
  let compoundCva: ReturnType<typeof cva>

  beforeAll(() => {
    baseCva = cva('flex items-center', {
      variants: {
        justify: {
          start: 'justify-start',
          center: 'justify-center',
          end: 'justify-end',
        },
        align: {
          top: 'items-start',
          center: 'items-center',
          bottom: 'items-end',
        },
      },
      defaultVariants: {
        justify: 'start',
        align: 'center',
      },
    })

    compoundCva = cva('bg-white', {
      variants: {
        state: {
          active: 'bg-blue-500 text-white',
          inactive: 'bg-gray-300 text-black',
        },
        size: {
          sm: 'p-2 text-sm',
          lg: 'p-4 text-lg',
        },
      },
      defaultVariants: {
        state: 'inactive',
        size: 'sm',
      },
      compoundVariants: [
        {
          state: 'active',
          size: 'lg',
          class: 'ring-4 ring-blue-300',
        },
        {
          state: 'inactive',
          size: 'sm',
          className: 'opacity-70',
        },
      ],
    })
  })

  describe('basic variant behavior', () => {
    it('should apply base classes and default variants', () => {
      const result = baseCva()
      expect(result).toEqual('flex items-center justify-start')
    })

    it('should override default variants with props', () => {
      const result = baseCva({ justify: 'center', align: 'top' })
      expect(result).toEqual('flex items-center justify-center items-start')
    })

    it('should correctly handle additional className prop', () => {
      const result = baseCva({ justify: 'end', className: 'gap-4' })
      expect(result).toEqual('flex items-center justify-end gap-4')
    })

    it('should correctly handle additional class prop', () => {
      const result = baseCva({ align: 'bottom', class: 'mt-2' })
      expect(result).toEqual('flex items-center justify-start items-end mt-2')
    })

    it('should merge class and className together', () => {
      const result = baseCva({
        justify: 'center',
        class: 'mx-2',
        className: 'gap-2',
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
      const result = compoundCva({ state: 'active', size: 'lg' })
      expect(result).toEqual('bg-white bg-blue-500 text-white p-4 text-lg ring-4 ring-blue-300')
    })

    it('should NOT apply compound class if not matching', () => {
      const result = compoundCva({ state: 'active', size: 'sm' })
      expect(result).toEqual('bg-white bg-blue-500 text-white p-2 text-sm')
    })

    it('should apply multiple compound conditions independently', () => {
      const result = compoundCva({ state: 'inactive', size: 'sm' })
      expect(result).toEqual('bg-white bg-gray-300 text-black p-2 text-sm opacity-70')
    })
  })

  describe('array classes handling', () => {
    const arrayCva = cva('relative', {
      variants: {
        color: {
          blue: ['bg-blue-500', 'hover:bg-blue-700'],
          red: ['bg-red-500', 'hover:bg-red-700'],
        },
      },
      defaultVariants: {
        color: 'blue',
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
        variants: {
          align: {
            center: 'text-center',
          },
        },
        defaultVariants: {
          align: 'center',
        },
      })()
      expect(result).toEqual('text-center')
    })
  })

  describe('caching behavior', () => {
    it('should cache results for identical props', () => {
      const first = baseCva({ justify: 'center', align: 'bottom' })
      const second = baseCva({ justify: 'center', align: 'bottom' })
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
      variants: {
        variant: {
          outlined: 'border-2 border-gray-300',
          filled: 'bg-gray-200',
        },
        size: {
          sm: 'p-2',
          md: 'p-4',
        },
      },
      compoundVariants: [
        {
          variant: 'outlined',
          size: 'md',
          class: 'shadow-md',
        },
        {
          variant: 'filled',
          size: 'sm',
          className: 'rounded-md',
        },
      ],
    })

    it('should apply multiple compound classes correctly', () => {
      const result = multiCompound({ variant: 'outlined', size: 'md' })
      expect(result).toEqual('border border-2 border-gray-300 p-4 shadow-md')
    })

    it('should apply a different compound class for different combination', () => {
      const result = multiCompound({ variant: 'filled', size: 'sm' })
      expect(result).toEqual('border bg-gray-200 p-2 rounded-md')
    })

    it('should fallback to only variant/size if no compound match', () => {
      const result = multiCompound({ variant: 'filled', size: 'md' })
      expect(result).toEqual('border bg-gray-200 p-4')
    })
  })
})
