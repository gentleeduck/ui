import type { Button, IButtonProps } from '../button'
import type { Pagination, PaginationContent, PaginationItem } from './pagination'

export interface IDuckPaginationProps {
  wrapper?: React.ComponentPropsWithoutRef<typeof Pagination>
  content?: React.ComponentPropsWithoutRef<typeof PaginationContent>
  item?: React.ComponentPropsWithoutRef<typeof PaginationItem>
  right?: React.ComponentPropsWithoutRef<typeof Button>
  maxRight?: React.ComponentPropsWithoutRef<typeof Button>
  left?: React.ComponentPropsWithoutRef<typeof Button>
  maxLeft?: React.ComponentPropsWithoutRef<typeof Button>
}

export interface IPaginationLinkProps
  extends Pick<IButtonProps, 'size'>,
    Omit<React.ComponentPropsWithoutRef<'a'>, 'size'> {
  isActive?: boolean
}

export type PaginationLinkProps = IPaginationLinkProps
