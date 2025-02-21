import { TableCell, TableRow } from '@/registry/registry-ui-components/table'
import { columns } from './table-1'
import { tableData } from './table-2'
import {
  DuckTable,
  DuckTableBody,
  DuckTableHeader,
  DuckTableProvider,
  DuckTableRowCheckbox,
  useDuckTable,
} from '@/registry/registry-ui-components/table/table-advanced'
import React from 'react'

export default function TableDemo3() {
  return (
    <>
      <DuckTableProvider table_rows={tableData} table_columns={columns}>
        <DuckTable>
          <DuckTableHeader />
          <DuckTableBody>
            <Rows />
          </DuckTableBody>
        </DuckTable>
      </DuckTableProvider>
    </>
  )
}
export function Rows() {
  const { tableRows, tableColumns } = useDuckTable<typeof columns>()
  return tableRows?.slice(0, 3).map((row, idx) => {
    return (
      <TableRow key={idx}>
        {Object.values(row).map((item, idx) => {
          const Component = () => (
            <div className="flex items-center gap-2 [&>svg]:size-4 [&>svg]:stroke-[1.5] [&>svg]:text-muted-foreground">
              {item.icon}
              <span className="text-ellipsis overflow-hidden duck-truncate">
                {item?.children}
              </span>
            </div>
          )

          return (
            !Array.from(tableColumns.values())[idx]?.['aria-hidden'] && (
              <TableCell key={idx}>
                {idx === 0 ? (
                  <div className="flex items-center gap-4">
                    <DuckTableRowCheckbox<typeof columns> tableRow={row} />
                    <Component />
                  </div>
                ) : (
                  <Component />
                )}
              </TableCell>
            )
          )
        })}
      </TableRow>
    )
  })
}
