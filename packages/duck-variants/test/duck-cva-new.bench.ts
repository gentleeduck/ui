import { cva as authorityFn } from 'cva'
import { bench, describe } from 'vitest'
import { cva as gentleduckFn } from '../src'
import { cva as prefPullRequestFn } from './cva-pref-pull-request'

const yourFn = gentleduckFn({
  base: 'button font-semibold border rounded',
  compoundVariants: [
    {
      className: 'button--primary-medium uppercase',
      intent: 'primary',
      size: 'medium',
    },
    {
      className: 'button--warning-enabled text-gray-800',
      disabled: 'false',
      intent: 'warning',
    },
    {
      className: ['button--warning-disabled'],
      disabled: 'true',
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
    disabled: 'false',
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
      danger: ['button--danger', 'hover:bg-red-600'],
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
})

const configCva = {
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
}

const theirFn = authorityFn(configCva as any)
const prefPullRequest = prefPullRequestFn(configCva as any)

const N = 3

describe('cva benchmark ', () => {
  describe('Scenario: Base Only', () => {
    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn()
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn()
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest()
      }
    })
  })

  describe('Scenario: One Variant Set', () => {
    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn({ intent: 'primary' })
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({ intent: 'primary' })
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({ intent: 'primary' })
      }
    })
  })

  describe('Scenario: Multiple Variants Set', () => {
    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn({ intent: 'secondary', size: 'small' })
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({ intent: 'secondary', size: 'small' })
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({ intent: 'secondary', size: 'small' })
      }
    })
  })

  describe('Scenario: Compound Variant Match', () => {
    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn({ intent: 'primary', size: 'medium' })
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({ intent: 'primary', size: 'medium' })
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({ intent: 'primary', size: 'medium' })
      }
    })
  })

  describe('Scenario: Compound Variant No Match', () => {
    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn({ intent: 'danger', size: 'large' })
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({ intent: 'danger', size: 'large' })
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({ intent: 'danger', size: 'large' })
      }
    })
  })

  describe('Scenario: With className', () => {
    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn({ className: 'custom-class', intent: 'primary' })
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({ className: 'custom-class', intent: 'primary' })
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({ className: 'custom-class', intent: 'primary' })
      }
    })
  })

  describe('Scenario: With class', () => {
    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn({ class: 'another-class', intent: 'primary' })
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({ class: 'another-class', intent: 'primary' })
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({ class: 'another-class', intent: 'primary' })
      }
    })
  })

  describe('Scenario: Default Variants Only', () => {
    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn({})
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({})
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({})
      }
    })
  })

  describe('Scenario: All Variants Set', () => {
    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn({ disabled: 'true', intent: 'warning', m: 1, size: 'large' })
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({ disabled: true, intent: 'warning', m: 1, size: 'large' })
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({
          disabled: true,
          intent: 'warning',
          m: 1,
          size: 'large',
        })
      }
    })
  })

  describe('Scenario: Cache Hit (Repeated Call)', () => {
    const props = { intent: 'primary', size: 'small' }
    yourFn(props) // Warm up
    theirFn(props)
    prefPullRequest(props)

    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn(props)
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn(props)
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest(props)
      }
    })
  })
})
