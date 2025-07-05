import { DuckTable } from './table-advanced'
import { DuckTableFilter, DuckTableHeader, DuckTableSearch } from './table-advanced.chunks'

export function TableDemo() {
  return (
    <div className="w-[765px] bg--900">
      <DuckTable>
        <DuckTableHeader>
          <DuckTableSearch />
          <DuckTableFilter />
        </DuckTableHeader>
        this is my table
      </DuckTable>
    </div>
  )
}
