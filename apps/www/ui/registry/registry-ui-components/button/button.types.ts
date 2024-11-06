import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { IconProps } from '@radix-ui/react-icons/dist/types'
import { VariantProps } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react'
import { buttonVariants } from './button.constants'
import { Badge } from '@/registry/default/ui'

export type IconType = {
  children: LucideIcon
} & Omit<IconProps, 'children'> &
  Omit<React.RefAttributes<SVGSVGElement>, 'children'>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isCollapsed?: boolean
  loading?: boolean
  icon?: IconType
  secondIcon?: IconType
  label?: LabelType
  command?: CommandType
  animationIcon?: {
    icon?: IconType
    iconPlacement?: 'left' | 'right'
  }
}

export interface LabelType
  extends Partial<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>,
    Partial<React.ComponentPropsWithoutRef<typeof Badge>> {
  showCommand?: boolean
  showLabel?: boolean
  delayDuration?: number
}

export type CommandType<T = unknown> = {
  label?: string
  key: string
  state?: T
  action?: <T>(arg?: T) => void
} & Partial<React.ComponentPropsWithoutRef<typeof Badge>>
