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
            <PaginationNext href="#" text={'\u0627\u0644\u062A\u0627\u0644\u064A'} />
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis text={'\u0635\u0641\u062D\u0627\u062A \u0623\u062E\u0631\u0649'} />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">{'\u0663'}</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#" isActive>
              {'\u0662'}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">{'\u0661'}</PaginationLink>
          </PaginationItem>

          {/* Previous goes at the end (visually left side) */}
          <PaginationItem>
            <PaginationPrevious href="#" text={'\u0627\u0644\u0633\u0627\u0628\u0642'} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
