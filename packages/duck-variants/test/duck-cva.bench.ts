import { bench, describe } from 'vitest'

import { cva as DuckCva } from '../src/variants'
import { cva as CvaPrefPullRequest } from './cva-pref-pull-request'
import { cva } from 'cva'

const buttonWithoutBaseWithDefaultsWithClassNameString = {
  base: 'button font-semibold border rounded',
  variants: {
    intent: {
      unset: null,
      primary: 'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
      secondary: 'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
      warning: 'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
      danger: [
        'button--danger',
        [1 && 'bg-red-500', { baz: false, bat: null }, ['text-white', ['border-transparent']]],
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
      className: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
    },
    {
      intent: ['warning', 'danger'],
      className: 'button--warning-danger !border-red-500',
    },
    {
      intent: ['warning', 'danger'],
      size: 'medium',
      className: 'button--warning-danger-medium',
    },
  ],
  defaultVariants: {
    m: 0,
    disabled: false,
    intent: 'primary',
    size: 'medium',
  },
} as any

const buttonVariants = DuckCva('', buttonWithoutBaseWithDefaultsWithClassNameString)

const _buttonVariants = cva(buttonWithoutBaseWithDefaultsWithClassNameString)

const __buttonVariants = CvaPrefPullRequest(buttonWithoutBaseWithDefaultsWithClassNameString)

describe.skip('benchmarking cva', () => {
  bench('duck cva', () => {
    buttonVariants({})
    buttonVariants({ intent: 'primary', disabled: true } as any)
    buttonVariants({ intent: 'primary', size: 'medium' } as any)
    buttonVariants({
      intent: 'warning',
      size: 'medium',
      disabled: true,
    } as any)
    buttonVariants({ size: 'small' } as any)
    buttonVariants({ size: 'large', intent: 'unset' } as any)
  })
  bench('cva pref pull request', () => {
    __buttonVariants({})
    __buttonVariants({ intent: 'primary', disabled: true } as any)
    __buttonVariants({ intent: 'primary', size: 'medium' } as any)
    __buttonVariants({
      intent: 'warning',
      size: 'medium',
      disabled: true,
    } as any)
    __buttonVariants({ size: 'small' } as any)
    __buttonVariants({ size: 'large', intent: 'unset' } as any)
  })
  bench('cva', () => {
    _buttonVariants({})
    _buttonVariants({ intent: 'primary', disabled: true } as any)
    _buttonVariants({ intent: 'primary', size: 'medium' } as any)
    _buttonVariants({
      intent: 'warning',
      size: 'medium',
      disabled: true,
    } as any)
    _buttonVariants({ size: 'small' } as any)
    _buttonVariants({ size: 'large', intent: 'unset' } as any)
  })
})
