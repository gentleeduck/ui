import type { Variants } from '@gentleduck/variants'
import type { buttonVariants } from './button.constants'

export interface IButtonProps
  extends Omit<React.HTMLProps<HTMLButtonElement>, 'size'>,
    Variants.VariantProps<typeof buttonVariants> {
  /** Render as child component using Slot (e.g., for custom wrappers) */
  asChild?: boolean
  /** Controls collapsed state for buttons like sidebar toggles */
  isCollapsed?: boolean
  /** Shows loading state/spinner in the button */
  loading?: boolean
  /** Primary icon to display in the button */
  icon?: React.ReactNode
  /** Secondary icon (e.g., for split actions or toggles) */
  secondIcon?: React.ReactNode
}

export type AnimationIconProps = {
  /** The content inside the icon wrapper */
  children: React.ReactNode
  /**
   * Optional animated icon configuration.
   * Modify the variant to use animation styles.
   */
  animationIcon?: {
    /** Icon to animate (if applicable) */
    icon?: React.ReactNode
    /** Determines icon position relative to the children */
    iconPlacement?: 'left' | 'right'
  }
}
