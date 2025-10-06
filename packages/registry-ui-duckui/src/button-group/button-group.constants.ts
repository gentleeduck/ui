import { cva } from '@gentleduck/variants'

export const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    defaultVariants: {
      orientation: 'horizontal',
    },
    variants: {
      orientation: {
        // [&>*:not(span):not(:first-of-type)]:rounded-l-none
        //   [&>*:not(span):not(:last-of-type)]:rounded-r-none
        //   [&>*:not(span):not(:first-of-type)]:border-l-0
        horizontal: `

[&>*:not(:first-child)]:rounded-l-none
[&>*:not(:last-child)]:rounded-r-none
[&>*:not(:first-child)]:border-l-0
`,
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
      },
    },
  },
)
