import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@gentleduck/registry-ui-duckui/pagination'

export default function PaginationRtlDemo() {
  return (
    <div dir="rtl" className="flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* In RTL: Next comes first (visually right side) */}
          <PaginationItem>
            <PaginationNext href="#" text="التالي" />
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis text="صفحات أخرى" />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">٣</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#" isActive>
              ٢
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">١</PaginationLink>
          </PaginationItem>

          {/* Previous goes at the end (visually left side) */}
          <PaginationItem>
            <PaginationPrevious href="#" text="السابق" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
