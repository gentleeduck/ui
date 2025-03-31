import { cva } from 'class-variance-authority'

export const tooltipVariants = cva(
  [
    // Base styles
    'flex z-50 absolute rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md overflow-hidden',
    // Animation base
    'select-none will-change-[transform,opacity]',
    'animate-in duration-[150ms] ease-in-out',
    'fade-in-0 zoom-in-95',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'opacity-0 scale-95 pointer-events-none',
          'group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100',
          'group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:scale-100',
          'group-hover/tooltip:transition-all group-hover/tooltip:duration-200 group-hover/tooltip:ease-[cubic-bezier(0.16,1,0.3,1)]',
          'group-hover/tooltip:transition-delay-[var(--tooltip-delay)]',
          'group-focus-within/tooltip:transition-all group-focus-within/tooltip:duration-200 group-focus-within/tooltip:ease-[cubic-bezier(0.16,1,0.3,1)]',
          'group-focus-within/tooltip:transition-delay-[var(--tooltip-delay)]',
        ],
        custom: '',
      },
      position: {
        top: [
          'bottom-[calc(100%+var(--side-offset))] left-1/2 -translate-x-1/2',
          'origin-[var(--radix-tooltip-content-transform-origin)]',
          'data-[side=top]:slide-in-from-bottom-2',
        ],
        bottom: [
          'top-[calc(100%+var(--side-offset))] left-1/2 -translate-x-1/2',
          'origin-[var(--radix-tooltip-content-transform-origin)]',
          'data-[side=bottom]:slide-in-from-top-2',
        ],
        left: [
          'right-[calc(100%+var(--side-offset))] top-1/2 -translate-y-1/2',
          'origin-[var(--radix-tooltip-content-transform-origin)]',
          'data-[side=left]:slide-in-from-right-2',
        ],
        right: [
          'left-[calc(100%+var(--side-offset))] top-1/2 -translate-y-1/2',
          'origin-[var(--radix-tooltip-content-transform-origin)]',
          'data-[side=right]:slide-in-from-left-2',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'top',
    },
  },
)

export const tooltipArrowVariants = cva(
  [
    'absolute w-2 h-2 bg-popover rotate-45 border',
    'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
  ].join(' '),
  {
    variants: {
      position: {
        top: ['bottom-[-4px] left-1/2 -translate-x-1/2', 'border-r border-b'],
        bottom: ['top-[-4px] left-1/2 -translate-x-1/2', 'border-l border-t'],
        left: ['right-[-4px] top-1/2 -translate-y-1/2', 'border-t border-r'],
        right: ['left-[-4px] top-1/2 -translate-y-1/2', 'border-b border-l'],
      },
    },
    defaultVariants: {
      position: 'top',
    },
  },
)
