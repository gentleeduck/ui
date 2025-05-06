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
  animationIcon?: {
    icon?: React.ReactNode
    iconPlacement?: 'left' | 'right'
  }
}
