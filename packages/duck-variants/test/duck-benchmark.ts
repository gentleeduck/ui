import { cva } from 'cva'
import { cva as gentleduckFn } from '../src'

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

const theirFn = cva({
  base: 'button rounded border font-semibold',
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
      true: 'button--disabled cursor-not-allowed opacity-050',
      unset: null,
    },
    intent: {
      danger: [
        'button--danger',
        [1 && 'bg-red-500', { bat: null, baz: false }, ['text-white', ['border-transparent']]],
        'hover:bg-red-600',
      ],
      primary: 'button--primary border-transparent bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'button--secondary border-gray-400 bg-white text-gray-800 hover:bg-gray-100',
      unset: null,
      warning: 'button--warning border-transparent bg-yellow-500 hover:bg-yellow-600',
    },
    m: {
      0: 'm-0',
      1: 'm-1',
      unset: null,
    },
    size: {
      large: 'button--large px-4 py-2.5 text-lg',
      medium: 'button--medium px-4 py-2 text-base',
      small: 'button--small px-2 py-1 text-sm',
      unset: null,
    },
  },
})

// Benchmark config
const N = 100_000

// Benchmark scenarios
const scenarios = {
  'All variants set': (fn: Function) => fn({ disabled: 'true', intent: 'warning', m: 1, size: 'large' }),
  'Base only': (fn: Function) => fn(),
  'Cache hit (repeated call)': (fn: Function) => {
    const props = { intent: 'primary', size: 'small' }
    fn(props) // Warm up
    for (let i = 0; i < N; i++) {
      fn(props)
    }
  },
  'Compound variant match': (fn: Function) => fn({ intent: 'primary', size: 'medium' }),
  'Compound variant no match': (fn: Function) => fn({ intent: 'danger', size: 'large' }),
  'Default variants only': (fn: Function) => fn({}),
  'Multiple variants set': (fn: Function) => fn({ intent: 'secondary', size: 'small' }),
  'One variant set': (fn: Function) => fn({ intent: 'primary' }),
  'With class': (fn: Function) => fn({ class: 'another-class', intent: 'primary' }),
  'With className': (fn: Function) => fn({ className: 'custom-class', intent: 'primary' }),
}

// Benchmark runner
async function runBenchmark() {
  const results: Array<{
    Scenario: string
    'gentleduck (ms)': number
    'Authority (ms)': number
    'Faster Version': string
    Speedup: string
  }> = []

  for (const [label, testFn] of Object.entries(scenarios)) {
    // Benchmark gentleduck
    const startgentleduck = performance.now()
    for (let i = 0; i < (label === 'Cache hit (repeated call)' ? 1 : N); i++) {
      testFn(yourFn)
    }
    const endgentleduck = performance.now()

    // Benchmark Authority
    const startAuthority = performance.now()
    for (let i = 0; i < (label === 'Cache hit (repeated call)' ? 1 : N); i++) {
      testFn(theirFn)
    }
    const endAuthority = performance.now()

    const gentleduckTime = +(endgentleduck - startgentleduck).toFixed(2)
    const authorityTime = +(endAuthority - startAuthority).toFixed(2)

    const gentleduckFaster = gentleduckTime < authorityTime
    const fasterVersion = gentleduckFaster ? '@gentleduck/variants' : 'class-variance-authority'

    const speedupRatio = gentleduckFaster ? authorityTime / gentleduckTime : gentleduckTime / authorityTime
    const speedup = `x${speedupRatio.toFixed(2)} faster`

    results.push({
      'Authority (ms)': authorityTime,
      'Faster Version': fasterVersion,
      'gentleduck (ms)': gentleduckTime,
      Scenario: label,
      Speedup: speedup,
    })
  }

  console.table(results)
}

runBenchmark()
