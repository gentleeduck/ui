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
import {
  Button,
  buttonVariants,
} from '@/registry/registry-ui-components/button'
import { cn } from '@/lib/cn'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/registry/registry-ui-components/alert-dialog'

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
                    <div className="flex items-center justify-between gap-4 w-full">
                      <Component />
                      {idx === Array.from(tableColumns.values()).length - 1 && (
                        <RowOptions key={idx} idx={idx} />
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

export const RowOptions = ({ idx }: { idx: number }) => {
  const { open, setOpen } = useDropdownMenuContext()
  console.log(open?.id, `sheet-${idx}`)

  return (
    <>
      {/* NOTE: THE FIRST TEST*/}
      <SheetWrapper
        open={open?.id.includes(`sheet`) && open.value}
        onOpenChange={(value) => {
          setOpen((_) => ({
            ..._!,
            value,
          }))
        }}
        trigger={{ className: 'sr-only' }}
        content={{
          children: <div className={cn('h-full')}>you're amazing wildduck</div>,
          _header: {
            _title: { children: <>Edit the table row</> },
            _description: { children: <>Set your daily calorie goal</> },
          },
          _footer: {
            className: 'flex w-full justify-between items-end',
            _submit: {
              children: (
                <Button
                  variant="default"
                  onClick={() => toast.success('Goal updated!')}
                >
                  Submit
                </Button>
              ),
            },
            _cancel: { children: <Button variant="outline">Cancel</Button> },
          },
        }}
      />

      {/* NOTE: THE MAIN TEST*/}
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
      />
      {/* NOTE: the second test*/}
      <AlertDialog
        open={open?.id.includes(`dialog`) && open.value}
        onOpenChange={(value) => {
          setOpen((_) => ({
            ..._!,
            value,
          }))
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-8">Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className={cn(
                  buttonVariants({
                    variant: 'destructive',
                    border: 'destructive',
                    className: 'px-8',
                  }),
                )}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function menuItems() {
  return [
    {
      icon: <Pen />,
      actionType: 'sheet',
      children: 'Settings',
    },
    {
      children: 'Delete',
      actionType: 'dialog',
      icon: <Trash2 />,
      className:
        'bg-destructive/10 text-destructive hover:!bg-destructive hover:!text-white',
    },
  ] as DropdownMenuOptionsDataType[]
}
