import { ToggleLeft } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@gentleduck/registry-ui-duckui/table'
import { useAtom, useAtomValue } from '@gentleduck/state/primitive'
import { duck_table } from './main'
import { DuckTable, DuckTablePagination, DuckTableRowPerPage, DuckTableSelectedRows } from './table-advanced'
import {
  DuckTableColumnView,
  DuckTableBar,
  DuckTableLeftSide,
  DuckTableRightSide,
  DuckTableSearch,
  DuckTableSortable,
} from './table-advanced.chunks'
import { cn } from './lib/utils'
import React from 'react'
import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'

export function TableDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <DuckTable className="w-[765px] flex flex-col gap-2.5 border rounded-md p-4 overflow-x-hidden">
        <DuckTableBar>
          <DuckTableRightSide>
            <DuckTableSearch />
          </DuckTableRightSide>

          <DuckTableLeftSide>
            <DuckTableColumnView
              trigger={{
                variant: 'default',
                children: (
                  <>
                    <ToggleLeft className="!size-5" />
                    <span>Columns</span>
                  </>
                ),
              }}
              heading="Select Columns"
            />
          </DuckTableLeftSide>
        </DuckTableBar>
        <TableDemo1 />

        <DuckTableBar>
          <DuckTableRightSide>
            <DuckTableSelectedRows />
          </DuckTableRightSide>

          <DuckTableLeftSide className="gap-8">
            <DuckTableRowPerPage />
            <DuckTablePagination />
          </DuckTableLeftSide>
        </DuckTableBar>
      </DuckTable>
    </div>
  )
}

export function TableDemo1() {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table style={{ width: '100%', tableLayout: 'fixed' }} className="overflow-hidden">
        <DuckTableHeader />

        <DuckTableBody />

        <TableFooter>
          <TableRow>
            <TableCell className="pl-3" colSpan={4}>
              Total
            </TableCell>
            <TableCell className="text-right pr-3">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export function DuckTableHeader({}: {}) {
  const headers = useAtomValue(duck_table.atoms.columns)

  const visibleHeaders = Object.values(headers).filter((header) => header.visible)
  const colCount = visibleHeaders.length
  const cellWidth = `${100 / colCount}%`

  function HeahderCheckboxSelect() {
    const mutatedRows = useAtomValue(duck_table.atoms.mutatedRows)
    const [selectedRows, setSelectedRows] = useAtom(duck_table.atoms.selectedRows)

    return (
      <Checkbox
        className="border-border"
        onChange={(e) => {
          if (e.currentTarget.checked) {
            setSelectedRows(mutatedRows.map((row) => row.id))
          } else {
            setSelectedRows([])
          }
        }}
        checked={
          selectedRows.length < mutatedRows.length && selectedRows.length > 0
            ? 'indeterminate'
            : selectedRows.length === mutatedRows.length
              ? true
              : false
        }
      />
    )
  }

  return (
    <TableHeader>
      <TableRow>
        {visibleHeaders.map((header, key) => {
          return (
            <React.Fragment key={key}>
              {key === 0 && (
                <TableHead className="w-[35px] pl-3">
                  <HeahderCheckboxSelect />
                </TableHead>
              )}
              <TableHead
                key={header.value}
                className={cn(
                  'whitespace-nowrap text-ellipsis capitalize',
                  key === colCount - 1 && 'text-right pr-3',
                  header.sortable && key === colCount - 1 && 'pr-0',
                  header.sortable && key === 0 && 'pl-4',
                  header.sortable && key !== colCount - 1 && '!px-0',
                )}
                style={{
                  width: cellWidth,
                  maxWidth: cellWidth,
                }}>
                {header.sortable ? <DuckTableSortable header={header} /> : header.value}
              </TableHead>
            </React.Fragment>
          )
        })}
      </TableRow>
    </TableHeader>
  )
}

export function DuckTableBody() {
  const rows = useAtomValue(duck_table.atoms.currentPageRows)
  const query = useAtomValue(duck_table.atoms.query)
  const columns = useAtomValue(duck_table.atoms.columns)

  const visibleKeys = Object.entries(columns)
    .filter(([_, config]) => config.visible)
    .map(([key]) => key)

  const newRows = rows.filter((invoice) => JSON.stringify(invoice).toLowerCase().includes(query.toLowerCase()))

  function RowCheckboxSelect({ id }: { id: (typeof newRows)[number]['id'] }) {
    const [selectedRows, setSelectedRows] = useAtom(duck_table.atoms.selectedRows)

    return (
      <Checkbox
        className="border-border"
        onChange={(e) => {
          if (e.currentTarget.checked) {
            setSelectedRows((prev) => [...prev, id])
          } else {
            setSelectedRows((prev) => prev.filter((row) => row !== id))
          }
        }}
        checked={selectedRows.includes(id)}
      />
    )
  }

  return (
    <TableBody>
      {newRows.length ? (
        newRows.map((row, key) => {
          const _row = Object.fromEntries(Object.entries(row).filter(([key]) => visibleKeys.includes(key)))
          return (
            <TableRow key={key}>
              {Object.values(_row).map((value, key) => {
                return (
                  <React.Fragment key={key}>
                    {key === 0 && (
                      <TableCell key={key} className="pl-3">
                        <RowCheckboxSelect id={row.id} />
                      </TableCell>
                    )}
                    <TableCell
                      key={key}
                      className={cn(
                        key === 0 && 'w-[100px]',
                        key === Object.keys(_row).length - 1 && 'text-right pr-3',
                      )}>
                      {value}
                    </TableCell>
                  </React.Fragment>
                )
              })}
            </TableRow>
          )
        })
      ) : (
        <TableRow>
          <TableCell colSpan={4} className="text-center">
            No results found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
