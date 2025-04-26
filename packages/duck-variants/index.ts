import { cva as yours } from './src'
import originalCVA from './test/cva'

// Define your CVA instance
const yourFn = yours({
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

// Their CVA instance
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
})

// Config
const N = 100_000

// Scenarios
const scenarios = {
  'Base only': (fn: Function) => fn(),
  'One variant set': (fn: Function) => fn({ intent: 'primary' }),
  'Multiple variants set': (fn: Function) =>
    fn({ intent: 'secondary', size: 'small' }),
  'Compound variant match': (fn: Function) =>
    fn({ intent: 'primary', size: 'medium' }),
  'Compound variant no match': (fn: Function) =>
    fn({ intent: 'danger', size: 'large' }),
  'With className': (fn: Function) =>
    fn({ intent: 'primary', className: 'custom-class' }),
  'With class': (fn: Function) =>
    fn({ intent: 'primary', class: 'another-class' }),
  'Default variants only': (fn: Function) => fn({}),
  'All variants set': (fn: Function) =>
    fn({ intent: 'warning', size: 'large', disabled: 'true', m: 1 }),
  'Cache hit (repeated call)': (fn: Function) => {
    const props = { intent: 'primary', size: 'small' }
    fn(props) // warmup
    for (let i = 0; i < N; i++) {
      fn(props)
    }
  },
}

async function runBenchmark() {
  const results: Record<
    string,
    { yours: number; theirs: number; faster: string; delta: string }
  > = {}

  for (const [label, testFn] of Object.entries(scenarios)) {
    // Benchmark yours
    const startYours = performance.now()
    for (let i = 0; i < (label === 'Cache hit (repeated call)' ? 1 : N); i++) {
      testFn(yourFn)
    }
    const endYours = performance.now()

    // Benchmark theirs
    const startTheirs = performance.now()
    for (let i = 0; i < (label === 'Cache hit (repeated call)' ? 1 : N); i++) {
      testFn(theirFn)
    }
    const endTheirs = performance.now()

    const yoursTime = +(endYours - startYours).toFixed(2)
    const theirsTime = +(endTheirs - startTheirs).toFixed(2)
    const faster = yoursTime < theirsTime ? 'yours' : 'theirs'
    const delta =
      (
        (Math.max(yoursTime, theirsTime) / Math.min(yoursTime, theirsTime) -
          1) *
        100
      ).toFixed(2) + '%'

    results[label] = {
      yours: yoursTime,
      theirs: theirsTime,
      faster,
      delta,
    }
  }

  console.table(results)
}

runBenchmark()
