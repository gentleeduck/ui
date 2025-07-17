import type * as PopoverPrimitive from '@gentleduck/aria-feather/popover'
import type { AnimPopoverVariants } from '@gentleduck/motion/anim'
import type { VariantProps } from '@gentleduck/variants'

export type PopoverContentProps = React.ComponentPropsWithRef<typeof PopoverPrimitive.Content> &
  VariantProps<typeof AnimPopoverVariants> & {
    sideOffset?: number
    alignOffset?: number
  }
