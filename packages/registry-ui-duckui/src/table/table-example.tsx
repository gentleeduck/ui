import { ChartPie } from 'lucide-react'
import { DuckTable } from './table-advanced'
import { DuckTableFilter, DuckTableHeader, DuckTableSearch } from './table-advanced.chunks'

export function TableDemo() {
  return (
    // <DuckTableSearch />
    // className="w-[765px] bg--900"
    <div>
      <DuckTable>
        <DuckTableHeader>
          <DuckTableFilter
            trigger={{
              children: (
                <>
                  <ChartPie className="!size-4" />
                  <span>Status</span>
                </>
              ),
            }}
            items={[
              {
                label: 'All',
                value: 'all',
              },
              {
                label: 'Active',
                value: 'active',
              },
              {
                label: 'Inactive',
                value: 'inactive',
              },
            ]}
            heading="Filter"
          />
        </DuckTableHeader>
        this is my table
      </DuckTable>
    </div>
  )
}
