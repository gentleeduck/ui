import * as React from 'react'
import type { Direction } from '../direction'
import { useDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'

const PAGINATION_NAME = 'Pagination'

type ScopedProps<P> = P & { __scopePagination?: Scope }
const [createPaginationContext, createPaginationScope] = createContextScope(PAGINATION_NAME)

type PaginationContextValue = { dir: Direction }
const [PaginationProvider, usePaginationContext] = createPaginationContext<PaginationContextValue>(PAGINATION_NAME)

type PaginationElement = React.ComponentRef<typeof Primitive.nav>
interface IPaginationProps extends React.ComponentPropsWithoutRef<typeof Primitive.nav> {
  dir?: Direction
}

const Pagination = React.forwardRef<PaginationElement, IPaginationProps>(
  (props: ScopedProps<IPaginationProps>, forwardedRef) => {
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

export type { IPaginationProps, PaginationContextValue, ScopedProps }
export { createPaginationScope, PAGINATION_NAME, Pagination, PaginationProvider, usePaginationContext }
