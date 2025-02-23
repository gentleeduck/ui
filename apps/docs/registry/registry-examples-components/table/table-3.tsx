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
import {
  ArrowUpDown,
  Calendar,
  Ellipsis,
  Laptop,
  LogOut,
  Moon,
  Pen,
  Settings,
  Sun,
  Trash2,
  User,
} from 'lucide-react'
import {
  DropdownMenuOptionsDataType,
  DropdownMenuProvider,
  DropdownMenuView,
  useDropdownMenuContext,
} from '@/registry/registry-ui-components/dropdown-menu/dropdown-menu-wrapper'
import { toast } from 'sonner'
import { SheetWrapper } from '@/registry/registry-ui-components/sheet'
import { Button } from '@/registry/registry-ui-components/button'

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

  return tableRows?.slice(0, 1).map((row, idx) => {
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
              <DropdownMenuProvider>
                <TableCell key={idx}>
                  {idx === 0 ? (
                    <div className="flex items-center gap-4">
                      <DuckTableRowCheckbox<typeof columns> tableRow={row} />
                      <Component />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <Component />
                      {idx === Array.from(tableColumns.values()).length - 1 && (
                        <RowOptions key={idx} id={`item-${idx}`} />
                      )}
                    </div>
                  )}
                </TableCell>
              </DropdownMenuProvider>
            )
          )
        })}
      </TableRow>
    )
  })
}

export const RowOptions = ({ id }: { id: `item-${number}` }) => {
  const { open, setOpen } = useDropdownMenuContext()
  return (
    <>
      <DropdownMenuView
        trigger={{
          variant: 'ghost',
          size: 'sm',
          icon: <Ellipsis />,
          className: 'px-1 py-0 h-auto',
          // command: { label: '⌘K' },
        }}
        content={{
          label: { children: 'User Menu' },
          options: {
            itemType: 'label',
            optionsData: menuItems(),
            group: [1, 1], // First 3 items in group 1, next 2 in group 2
          },
          className: 'min-w-[180px]',
        }}
        // modal={false}
        open={!!open.id}
      // onOpenChange={setOpen}
      />

      <SheetWrapper
        open={open.value}
        onOpenChange={(value) => {
          console.log(value)
          setOpen({
            id: open.id,
            value,
          })
        }}
        content={{
          className:
            '[&>div]:flex [&>div]:flex-col [&>div]:place-content-center [&>div]:w-fit [&>div]:place-self-center sm:max-w-[450px]',
          children: 'asdfasdf',
          _header: {
            _title: { children: <>Goal</> },
            _description: { children: <>Set your daily calorie goal</> },
          },
          _footer: {
            className: 'flex w-full justify-between items-end',
            _submit: (
              <Button
                variant="default"
                onClick={() => toast.success('Goal updated!')}
              >
                Submit
              </Button>
            ),
            _cancel: <Button variant="outline">Cancel</Button>,
          },
        }}
      />
    </>
  )
}

function menuItems() {
  return [
    {
      className: 'px-0',
      children: 'Settings',
    },
    {
      children: 'Delete',
      icon: <Trash2 />,
      className:
        'bg-destructive/10 text-destructive hover:!bg-destructive hover:!text-white',
    },
  ] as DropdownMenuOptionsDataType[]
}
