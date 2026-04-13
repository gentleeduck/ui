import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, usePaginationContext } from './pagination'

const CONTENT_NAME = 'PaginationContent'

type PaginationContentElement = React.ComponentRef<typeof Primitive.ul>
type PrimitiveUlProps = React.ComponentPropsWithoutRef<typeof Primitive.ul>
interface IPaginationContentProps extends PrimitiveUlProps {}

const PaginationContent = React.forwardRef<PaginationContentElement, IPaginationContentProps>(
  (props: ScopedProps<IPaginationContentProps>, forwardedRef) => {
    const { __scopePagination, ...contentProps } = props
    const context = usePaginationContext(CONTENT_NAME, __scopePagination)
    return <Primitive.ul data-slot="pagination-content" dir={context.dir} {...contentProps} ref={forwardedRef} />
  },
)

PaginationContent.displayName = CONTENT_NAME

export type { IPaginationContentProps }
export { PaginationContent }
