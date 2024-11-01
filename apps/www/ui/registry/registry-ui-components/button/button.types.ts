import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { IconProps } from '@radix-ui/react-icons/dist/types'
import { VariantProps } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react'
import { buttonVariants } from './button.constants'

export type IconType = {
  children: LucideIcon
} & Omit<IconProps, 'children'> &
  Omit<React.RefAttributes<SVGSVGElement>, 'children'>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isCollapsed?: boolean
  icon?: IconType
  title?: string
  secondIcon?: IconType
  label?: LabelType
  command?: CommandType
  loading?: boolean
}

export interface LabelType extends Partial<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>> {
  showCommand?: boolean
  showLabel?: boolean
  delayDuration?: number
  type?: 'notification' | 'default'
}

export type CommandType<T = unknown> = {
  label?: string
  key: string
  state?: T
  action?: <T>(arg?: T) => void
}
