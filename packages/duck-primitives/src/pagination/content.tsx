import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { usePaginationContext } from './pagination'
import type { IPagination } from './pagination.types'

const CONTENT_NAME = 'PaginationContent'

type PaginationContentElement = React.ComponentRef<typeof Primitive.ul>

const PaginationContent = React.forwardRef<PaginationContentElement, IPagination.IContentProps>(
  (props: IPagination.IScoped<IPagination.IContentProps>, forwardedRef) => {
    const { __scopePagination, ...contentProps } = props
    const context = usePaginationContext(CONTENT_NAME, __scopePagination)
    return <Primitive.ul data-slot="pagination-content" dir={context.dir} {...contentProps} ref={forwardedRef} />
  },
)

PaginationContent.displayName = CONTENT_NAME

export { PaginationContent }
