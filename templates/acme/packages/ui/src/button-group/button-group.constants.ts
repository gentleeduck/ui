import { cva } from '@gentleduck/variants'

export const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:relative [&>*]:hover:z-[1] [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    defaultVariants: {
      orientation: 'horizontal',
    },
    variants: {
      orientation: {
        horizontal: `
[&>*:not(:first-child)]:rounded-s-none
[&>*:not(:last-child)]:rounded-e-none
[&>*:nth-last-child(2):has(+span[aria-hidden])]:!rounded-e-md
[&>*:not(:first-child)]:-ms-px
`,
        vertical: `
flex-col
[&>*:not(:first-child)]:rounded-t-none
[&>*:not(:last-child)]:rounded-b-none
[&>*:not(:first-child)]:-mt-px
`,
      },
    },
  },
)
