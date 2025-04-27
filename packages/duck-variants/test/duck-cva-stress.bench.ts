import { bench, describe } from 'vitest'

import { cva as DuckCva } from '../src/variants'
import { cva as CvaPrefPullRequest } from './cva-pref-pull-request'
import { cva } from 'cva'

const buttonWithoutBaseWithDefaultsWithClassNameString = {
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
        ],
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
      className: [
        'button--warning-disabled',
        [1 && 'text-black', { baz: false, bat: null }],
      ],
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

const buttonVariants = DuckCva(
  '',
  buttonWithoutBaseWithDefaultsWithClassNameString,
)

const _buttonVariants = cva(
  buttonWithoutBaseWithDefaultsWithClassNameString,
)

const __buttonVariants = CvaPrefPullRequest(
  buttonWithoutBaseWithDefaultsWithClassNameString,
)
const testCases = [
  {},
  { intent: 'primary', disabled: true },
  { intent: 'primary', size: 'medium' },
  { intent: 'warning', size: 'medium', disabled: true },
  { size: 'small' },
  { size: 'large', intent: 'unset' }
]

describe('benchmarking cva with high stress', () => {
  bench('duck cva', () => {
    for (let iteration = 0; iteration < 3; iteration++) {
      for (const testCase of testCases) {
        buttonVariants(testCase)
      }
    }
  }, { iterations: 10000 })

  bench('cva pref pull request', () => {
    for (let iteration = 0; iteration < 3; iteration++) {
      for (const testCase of testCases) {
        __buttonVariants(testCase)
      }
    }
  }, { iterations: 10000 })

  bench('cva', () => {
    for (let iteration = 0; iteration < 3; iteration++) {
      for (const testCase of testCases) {
        _buttonVariants(testCase)
      }
    }
  }, { iterations: 10000 })
})