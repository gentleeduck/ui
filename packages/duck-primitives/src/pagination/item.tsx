import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { usePaginationContext } from './pagination'
import type { IPagination } from './pagination.types'

const ITEM_NAME = 'PaginationItem'

type PaginationItemElement = React.ComponentRef<typeof Primitive.li>

const PaginationItem = React.forwardRef<PaginationItemElement, IPagination.IItemProps>(
  (props: IPagination.IScoped<IPagination.IItemProps>, forwardedRef) => {
    const { __scopePagination, ...itemProps } = props
    const context = usePaginationContext(ITEM_NAME, __scopePagination)
    return <Primitive.li data-slot="pagination-item" dir={context.dir} {...itemProps} ref={forwardedRef} />
  },
)

PaginationItem.displayName = ITEM_NAME

export { PaginationItem }
