import * as React from 'react'
import { useDirection } from '../direction'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import type { IPagination } from './pagination.types'

const PAGINATION_NAME = 'Pagination'

const [createPaginationContext, createPaginationScope] = createContextScope(PAGINATION_NAME)

const [PaginationProvider, usePaginationContext] = createPaginationContext<IPagination.IContext>(PAGINATION_NAME)

type PaginationElement = React.ComponentRef<typeof Primitive.nav>

const Pagination = React.forwardRef<PaginationElement, IPagination.IProps>(
  (props: IPagination.IScoped<IPagination.IProps>, forwardedRef) => {
    const { __scopePagination, dir, ...paginationProps } = props
    const direction = useDirection(dir)
    return (
      <PaginationProvider scope={__scopePagination} dir={direction}>
        <Primitive.nav
          data-slot="pagination"
          dir={direction}
          {...paginationProps}
          aria-label={paginationProps['aria-label'] ?? 'pagination'}
          ref={forwardedRef}
        />
      </PaginationProvider>
    )
  },
)

Pagination.displayName = PAGINATION_NAME

export { createPaginationScope, PAGINATION_NAME, Pagination, PaginationProvider, usePaginationContext }
