import { bench, describe } from 'vitest'
import { cva as gentleduckFn } from '../src'
import { cva as authorityFn } from 'cva'
import { cva as prefPullRequestFn } from './cva-pref-pull-request'

const yourFn = gentleduckFn({
  base: 'button font-semibold border rounded',
  variants: {
    intent: {
      unset: null,
      primary: 'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
      secondary: 'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
      warning: 'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
      danger: ['button--danger', 'hover:bg-red-600'],
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
    disabled: 'false',
    intent: 'primary',
    size: 'medium',
  },
})

const configCva = {
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
        yourFn({ intent: 'primary', className: 'custom-class' })
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({ intent: 'primary', className: 'custom-class' })
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({ intent: 'primary', className: 'custom-class' })
      }
    })
  })

  describe('Scenario: With class', () => {
    bench('@gentleduck/variants', () => {
      for (let i = 0; i < N; i++) {
        yourFn({ intent: 'primary', class: 'another-class' })
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({ intent: 'primary', class: 'another-class' })
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({ intent: 'primary', class: 'another-class' })
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
        yourFn({ intent: 'warning', size: 'large', disabled: 'true', m: 1 })
      }
    })

    bench('class-variance-authority', () => {
      for (let i = 0; i < N; i++) {
        theirFn({ intent: 'warning', size: 'large', disabled: true, m: 1 })
      }
    })
    bench('cva pref pull request', () => {
      for (let i = 0; i < N; i++) {
        prefPullRequest({
          intent: 'warning',
          size: 'large',
          disabled: true,
          m: 1,
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
