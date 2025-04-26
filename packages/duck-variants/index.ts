export * from './src'

import { cva as yours } from './src'
import { VariantParams } from './src/variants.types'
import originalCVA from './test/cva'

const yourFn = yours('px-4 py-2', {
  variants: {
    intent: {
      unset: null,
      primary:
        'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
      secondary:
        'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
      warning:
        'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
      danger: [
        'button--danger',
        [
          1 && 'bg-red-500',
          { baz: false, bat: null },
          ['text-white', ['border-transparent']],
        ].join(' '),
        'hover:bg-red-600',
      ],
    },
    disabled: {
      unset: null,
      true: 'button--disabled opacity-050 cursor-not-allowed',
      false: 'button--enabled cursor-pointer',
    },
    size: {
      unset: null,
      small: 'button--small text-sm py-1 px-2',
      medium: 'button--medium text-base py-2 px-4',
      large: 'button--large text-lg py-2.5 px-4',
    },
    m: {
      unset: null,
      0: 'm-0',
      1: 'm-1',
    },
  },
  compoundVariants: [
    {
      intent: 'primary',
      size: 'medium',
      className: 'button--primary-medium uppercase',
    },
    {
      intent: 'warning',
      disabled: 'false',
      className: 'button--warning-enabled text-gray-800',
    },
    {
      intent: 'warning',
      disabled: 'true',
      className: ['button--warning-disabled'],
    },
  ],
  defaultVariants: {
    m: 0,
    disabled: 'false',
    intent: 'primary',
    size: 'medium',
  },
})
const theirFn = originalCVA({
  base: 'button font-semibold border rounded',
  variants: {
    intent: {
      unset: null,
      primary:
        'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
      secondary:
        'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
      warning:
        'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
      danger: [
        'button--danger',
        [
          1 && 'bg-red-500',
          { baz: false, bat: null },
          ['text-white', ['border-transparent']],
        ].join(' '),
        'hover:bg-red-600',
      ],
    },
    disabled: {
      unset: null,
      true: 'button--disabled opacity-050 cursor-not-allowed',
      false: 'button--enabled cursor-pointer',
    },
    size: {
      unset: null,
      small: 'button--small text-sm py-1 px-2',
      medium: 'button--medium text-base py-2 px-4',
      large: 'button--large text-lg py-2.5 px-4',
    },
    m: {
      unset: null,
      0: 'm-0',
      1: 'm-1',
    },
  },
  compoundVariants: [
    {
      intent: 'primary',
      size: 'medium',
      className: 'button--primary-medium uppercase',
    },
    {
      intent: 'warning',
      disabled: false,
      className: 'button--warning-enabled text-gray-800',
    },
    {
      intent: 'warning',
      disabled: true,
      className: ['button--warning-disabled'],
    },
  ],
  defaultVariants: {
    m: 0,
    disabled: false,
    intent: 'primary',
    size: 'medium',
  },
})

const N = 100_000
console.time('yours')
for (let i = 0; i < N; i++) yourFn({ size: 'small', intent: 'primary' })
console.timeEnd('yours')

console.time('theirs')
for (let i = 0; i < N; i++) theirFn({ intent: 'primary' })
console.timeEnd('theirs')
