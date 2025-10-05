import { cva } from '@gentleduck/variants'

export const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    defaultVariants: {
      orientation: 'horizontal',
    },
    variants: {
      orientation: {
        horizontal: `
[&>:is(button,input):not(:first-child)]:rounded-l-none
[&>:is(button,input)]:rounded-r-none
[&>:is(button,input):nth-last-child(2):has(+span[aria-hidden])]:!rounded-r-md
[&>:is(button,input):last-child]:!rounded-r-md
[&>:is(button,input):not(:first-child)]:border-l-0
`,
        vertical: `
flex-col
[&>*:not(:first-child)]:rounded-t-none
[&>*:not(:last-child)]:rounded-b-none
[&>*:not(:first-child)]:border-t-0
`,
      },
    },
  },
)
