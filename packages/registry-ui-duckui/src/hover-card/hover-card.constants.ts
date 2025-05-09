import { cva } from '@gentleduck/variants'

export const hoverCardVariants = cva(
  [
    // Base styles
    'absolute z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden whitespace-normal break-words',
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
          'group-hover/hover-card:opacity-100 group-hover/hover-card:scale-100',
          'group-focus-within/hover-card:opacity-100 group-focus-within/hover-card:scale-100',
          'group-hover/hover-card:transition-all group-hover/hover-card:duration-200 group-hover/hover-card:ease-[cubic-bezier(0.16,1,0.3,1)]',
          'group-hover/hover-card:delay-[var(--hover-card-delay)]',
          'group-focus-within/hover-card:transition-all group-focus-within/hover-card:duration-200 group-focus-within/hover-card:ease-[cubic-bezier(0.16,1,0.3,1)]',
          'group-focus-within/hover-card:delay-[var(--hover-card-delay)]',

          // if the open prop is true this is will simulate the open on hover
          'group-data-[method="forced"]/hover-card:opacity-100 group-data-[method="forced"]/hover-card:scale-100',
          'group-data-[method="forced"]/hover-card:transition-all group-data-[method="forced"]/hover-card:duration-200 group-data-[method="forced"]/hover-card:ease-[cubic-bezier(0.16,1,0.3,1)]',
          'group-data-[method="forced"]/hover-card:delay-[var(--hover-card-delay)]',
        ],
      },
      position: {
        center: 'left-1/2 -translate-x-1/2',
        right: 'left-full top-1/2 -translate-y-1/2',
        left: 'right-full top-1/2 -translate-y-1/2',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'center',
    },
  },
)
