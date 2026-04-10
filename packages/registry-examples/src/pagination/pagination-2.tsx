import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@gentleduck/registry-ui/pagination'

export default function Demo() {
  return (
    <Pagination dir="rtl">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" text="السابق" />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#">١</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#" isActive>
            ٢
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#">٣</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis text="صفحات أخرى" />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext href="#" text="التالي" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
