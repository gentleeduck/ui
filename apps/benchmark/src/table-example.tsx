import { ChartPie, ToggleLeft } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
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
  DuckTableFilter,
  DuckTableBar,
  DuckTableLeftSide,
  DuckTableRightSide,
  DuckTableSearch,
} from './table-advanced.chunks'
import { createDuckTable } from './table.hooks'
import { cn } from './lib/utils'
const hi = [
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
] as const

export function TableDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <DuckTable className="w-[765px] flex flex-col gap-4 border rounded-md p-4" table={duck_table}>
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
            {
              // <DuckTableSelectedRows />
            }
          </DuckTableRightSide>

          <DuckTableLeftSide className="gap-8">
            {
              // <DuckTableRowPerPage atoms={duck_table.atoms} actions={duck_table.actions} />
              //   <DuckTablePagination actions={duck_table.actions} atoms={duck_table.atoms} />
            }
          </DuckTableLeftSide>
        </DuckTableBar>
      </DuckTable>
    </div>
  )
}

export function TableDemo1() {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <DuckTableHeader />

        <DuckTableBody />

        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export function DuckTableHeader({}: {}) {
  const headres = useAtomValue(duck_table.atoms.columns)
  return (
    <TableHeader>
      <TableRow>
        {Object.values(headres).map(
          (header, key) =>
            header.visible && (
              <TableHead
                key={header.value}
                className={cn(key === 0 && 'w-[100px]', key === Object.keys(headres).length - 1 && 'text-right')}>
                {header.value}
              </TableHead>
            ),
        )}
      </TableRow>
    </TableHeader>
  )
}

export function DuckTableBody() {
  const rows = useAtomValue(duck_table.atoms.rows)
  const query = useAtomValue(duck_table.atoms.query)
  const columns = useAtomValue(duck_table.atoms.columns)

  const visibleKeys = Object.entries(columns)
    .filter(([_, config]) => config.visible)
    .map(([key]) => key)

  const newRows = rows.filter((invoice) => JSON.stringify(invoice).toLowerCase().includes(query.toLowerCase()))

  return (
    <TableBody>
      {newRows.length ? (
        newRows.map((invoice, key) => {
          const _invoice = Object.fromEntries(Object.entries(invoice).filter(([key]) => visibleKeys.includes(key)))
          return (
            <TableRow key={key}>
              {Object.values(_invoice).map((value, key) => (
                <TableCell
                  key={key}
                  className={cn(
                    // 'w-full max-w-[100px] truncate',
                    key === 0 && 'w-[100px]',
                    key === Object.keys(_invoice).length - 1 && 'text-right',
                  )}>
                  {value}
                </TableCell>
              ))}
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
