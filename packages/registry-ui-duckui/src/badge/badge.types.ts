import { VariantProps } from '@gentleduck/variants'
import { badgeVariants } from './badge.constants'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
