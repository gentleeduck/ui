import { VariantProps } from '@gentleduck/variants'
import { buttonVariants } from './button.constants'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isCollapsed?: boolean
  loading?: boolean
  icon?: React.ReactNode
  secondIcon?: React.ReactNode
}

export type AnimationIconProps = {
  children: React.ReactNode
  /** If you want to animate an icon, please modify the variant to any variant that animate the icon */
  animationIcon?: {
    icon?: React.ReactNode
    iconPlacement?: 'left' | 'right'
  }
}
