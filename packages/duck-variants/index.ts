export * from './src'

import { cva } from './src'

const button = cva({
  base: 'button font-semibold border rounded',
  variants: {
    intent: {
      primary:
        'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
      warning:
        'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
      danger: ['button--danger', 'hover:bg-red-600'],
    },
    size: {
      unset: null,
      small: 'button--small text-sm py-1 px-2',
      medium: 'button--medium text-base py-2 px-4',
      large: 'button--large text-lg py-2.5 px-4',
    },
  },
  compoundVariants: [
    {
      intent: 'warning',
      className: 'button--warning-enabled text-gray-800',
    },
    {
      intent: ['warning', 'danger'],
      className: 'button--warning-danger !border-red-500',
    },
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
})

console.log(
  button({
    intent: 'danger',
    size: 'large',
    className: 'flex items-center gap-3 px-2',
    class: 'red__header_top',
  }),
)
