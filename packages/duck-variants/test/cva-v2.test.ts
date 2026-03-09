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
})
