import { VariantProps } from 'class-variance-authority'
import { LabelType } from '../button'
import { badgeVariants } from './badge.constants'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  label?: Omit<LabelType, 'showCommand'>
}
