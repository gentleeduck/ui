import type { Button, ButtonProps } from '../button'
import type { Pagination, PaginationContent, PaginationItem } from './pagination'

export interface DuckPaginationProps {
  wrapper?: React.ComponentPropsWithoutRef<typeof Pagination>
  content?: React.ComponentPropsWithoutRef<typeof PaginationContent>
  item?: React.ComponentPropsWithoutRef<typeof PaginationItem>
  right?: React.ComponentPropsWithoutRef<typeof Button>
  maxRight?: React.ComponentPropsWithoutRef<typeof Button>
  left?: React.ComponentPropsWithoutRef<typeof Button>
  maxLeft?: React.ComponentPropsWithoutRef<typeof Button>
}

export type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  Omit<React.HTMLProps<HTMLAnchorElement>, 'size'>
