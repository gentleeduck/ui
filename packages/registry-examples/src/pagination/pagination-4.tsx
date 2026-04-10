'use client'

import {
  MotionPagination,
  MotionPaginationLink,
  MotionPaginationNext,
  MotionPaginationPrevious,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@gentleduck/registry-ui/pagination'

export default function Demo() {
  return (
    <MotionPagination>
      <PaginationContent>
        <PaginationItem>
          <MotionPaginationPrevious href="#" index={0} />
        </PaginationItem>
        <PaginationItem>
          <MotionPaginationLink href="#" index={1}>
            1
          </MotionPaginationLink>
        </PaginationItem>
        <PaginationItem>
          <MotionPaginationLink href="#" isActive index={2}>
            2
          </MotionPaginationLink>
        </PaginationItem>
        <PaginationItem>
          <MotionPaginationLink href="#" index={3}>
            3
          </MotionPaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <MotionPaginationNext href="#" index={4} />
        </PaginationItem>
      </PaginationContent>
    </MotionPagination>
  )
}
