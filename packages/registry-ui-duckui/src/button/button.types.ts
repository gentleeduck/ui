import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { VariantProps } from 'class-variance-authority'
import { buttonVariants } from './button.constants'
import { Badge } from '../badge'
import { Tooltip, TooltipContent } from '../tooltip'
import { ButtonTooltipProps } from './button'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  label?: [
    React.ElementType<ButtonTooltipProps>,
    ButtonTooltipProps['content'],
    Omit<ButtonTooltipProps['tooltip'], 'children'>,
  ]
  // command?: [React.ElementType<{}>]

  isCollapsed?: boolean
  loading?: boolean
  icon?: React.ReactNode
  secondIcon?: React.ReactNode
  animationIcon?: {
    icon?: React.ReactNode
    iconPlacement?: 'left' | 'right'
  }
}

export interface LabelType
  extends Partial<
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
    >,
    Partial<React.ComponentPropsWithoutRef<typeof Badge>>,
    Partial<React.ComponentPropsWithoutRef<typeof Tooltip>> {
  showCommand?: boolean
  showLabel?: boolean
  delayDuration?: number
}

export type CommandType = {
  key: string
  show?: boolean
  action?: <T>(arg?: T) => void
} & Partial<React.ComponentPropsWithoutRef<typeof Badge>>
