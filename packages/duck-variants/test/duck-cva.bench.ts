import { cva } from 'cva'
import { bench, describe } from 'vitest'
import { cva as DuckCva } from '../src/variants'
import { cva as CvaPrefPullRequest } from './cva-pref-pull-request'

const buttonWithoutBaseWithDefaultsWithClassNameString = {
  base: 'button font-semibold border rounded',
  compoundVariants: [
    {
      className: 'button--primary-medium uppercase',
      intent: 'primary',
      size: 'medium',
    },
    {
      className: 'button--warning-enabled text-gray-800',
      disabled: false,
      intent: 'warning',
    },
    {
      className: ['button--warning-disabled', [1 && 'text-black', { bat: null, baz: false }]],
      disabled: true,
      intent: 'warning',
    },
    {
      className: 'button--warning-danger !border-red-500',
      intent: ['warning', 'danger'],
    },
    {
      className: 'button--warning-danger-medium',
      intent: ['warning', 'danger'],
      size: 'medium',
    },
  ],
  defaultVariants: {
    disabled: false,
    intent: 'primary',
    m: 0,
    size: 'medium',
  },
  variants: {
    disabled: {
      false: 'button--enabled cursor-pointer',
      true: 'button--disabled opacity-050 cursor-not-allowed',
      unset: null,
    },
    intent: {
      danger: [
        'button--danger',
        [1 && 'bg-red-500', { bat: null, baz: false }, ['text-white', ['border-transparent']]],
        'hover:bg-red-600',
      ],
      primary: 'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
      secondary: 'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
      unset: null,
      warning: 'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
    },
    m: {
      0: 'm-0',
      1: 'm-1',
      unset: null,
    },
    size: {
      large: 'button--large text-lg py-2.5 px-4',
      medium: 'button--medium text-base py-2 px-4',
      small: 'button--small text-sm py-1 px-2',
      unset: null,
    },
  },
} as unknown

const buttonVariants = DuckCva('', buttonWithoutBaseWithDefaultsWithClassNameString as Record<string, Record<string, string | string[]>>)

const _buttonVariants = cva(buttonWithoutBaseWithDefaultsWithClassNameString)

const __buttonVariants = CvaPrefPullRequest(buttonWithoutBaseWithDefaultsWithClassNameString)

describe.skip('benchmarking cva', () => {
  bench('duck cva', () => {
    buttonVariants({})
    buttonVariants({ disabled: true, intent: 'primary' } as Record<string, unknown>)
    buttonVariants({ intent: 'primary', size: 'medium' } as Record<string, unknown>)
    buttonVariants({
      disabled: true,
      intent: 'warning',
      size: 'medium',
    } as Record<string, unknown>)
    buttonVariants({ size: 'small' } as Record<string, unknown>)
    buttonVariants({ intent: 'unset', size: 'large' } as Record<string, unknown>)
  })
  bench('cva pref pull request', () => {
    __buttonVariants({})
    __buttonVariants({ disabled: true, intent: 'primary' } as Record<string, unknown>)
    __buttonVariants({ intent: 'primary', size: 'medium' } as Record<string, unknown>)
    __buttonVariants({
      disabled: true,
      intent: 'warning',
      size: 'medium',
    } as Record<string, unknown>)
    __buttonVariants({ size: 'small' } as Record<string, unknown>)
    __buttonVariants({ intent: 'unset', size: 'large' } as Record<string, unknown>)
  })
  bench('cva', () => {
    _buttonVariants({})
    _buttonVariants({ disabled: true, intent: 'primary' } as Record<string, unknown>)
    _buttonVariants({ intent: 'primary', size: 'medium' } as Record<string, unknown>)
    _buttonVariants({
      disabled: true,
      intent: 'warning',
      size: 'medium',
    } as Record<string, unknown>)
    _buttonVariants({ size: 'small' } as Record<string, unknown>)
    _buttonVariants({ intent: 'unset', size: 'large' } as Record<string, unknown>)
  })
})
