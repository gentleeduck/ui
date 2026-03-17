import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, usePaginationContext } from './pagination'

const ITEM_NAME = 'PaginationItem'

type PaginationItemElement = React.ComponentRef<typeof Primitive.li>
type PrimitiveLiProps = React.ComponentPropsWithoutRef<typeof Primitive.li>
interface PaginationItemProps extends PrimitiveLiProps {}

const PaginationItem = React.forwardRef<PaginationItemElement, PaginationItemProps>(
  (props: ScopedProps<PaginationItemProps>, forwardedRef) => {
    const { __scopePagination, ...itemProps } = props
    const context = usePaginationContext(ITEM_NAME, __scopePagination)
    return <Primitive.li data-slot="pagination-item" dir={context.dir} {...itemProps} ref={forwardedRef} />
  },
)

PaginationItem.displayName = ITEM_NAME

export type { PaginationItemProps }
export { PaginationItem }
