import { columns } from './table-1'
import { tableData } from './table-2'
import {
  DuckTable,
  DuckTableHeader,
  DuckTableProvider,
} from '@/registry/registry-ui-components/table/table-advanced'

export default function TableDemo3() {
  return (
    <>
      <DuckTableProvider table_rows={tableData} table_columns={columns}>
        <DuckTable>
          <DuckTableHeader />
        </DuckTable>
      </DuckTableProvider>
    </>
  )
}
