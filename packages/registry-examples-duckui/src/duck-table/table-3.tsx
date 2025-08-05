import { TableCell, TableRow } from '@/registry/registry-ui-components/table'
import { columns } from './table-1'
import { tableData } from './table-2'
import {
  DuckTable,
  DuckTableBody,
  DuckTableHeader,
  DuckTableProvider,
  DuckTableRowCheckbox,
  DuckTableSearchInput,
  DuckTableTopBar,
  useDuckTable,
} from '@/registry/registry-ui-components/table/table-advanced'
import React from 'react'
import { Ellipsis, Pen, Trash2 } from 'lucide-react'
import {
  DropdownMenuOptionsDataType,
  DropdownMenuProvider,
  DropdownMenuView,
  useDropdownMenuContext,
} from '@/registry/registry-ui-components/dropdown-menu/dropdown-menu-wrapper'
import { toast } from 'sonner'
import { SheetWrapper } from '@/registry/registry-ui-components/sheet'
import { Button, buttonVariants } from '@/registry/registry-ui-components/button'
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
} from '@/registry/registry-ui-components/alert-dialog'

export default function TableDemo3() {
  return (
    <>
      <DuckTableProvider table_rows={tableData} table_columns={columns}>
        <DuckTableTopBar>
          <DuckTableSearchInput />
        </DuckTableTopBar>
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

  return tableRows?.map((row, idx) => {
    return (
      <TableRow key={idx}>
        {Object.values(row).map((item, idx) => {
          const Component = () => (
            <div className="flex items-center gap-2 [&>svg]:size-4 [&>svg]:stroke-[1.5] [&>svg]:text-muted-foreground">
              {item.icon}
              <span className="text-ellipsis overflow-hidden duck-truncate">{item?.children}</span>
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
                  <div className="flex items-center justify-between gap-4 w-full">
                    <Component />
                    {idx === Array.from(tableColumns.values()).length - 1 && (
                      <DropdownMenuProvider>
                        <RowOptions key={idx} idx={idx} />
                      </DropdownMenuProvider>
                    )}
                  </div>
                )}
              </TableCell>
            )
          )
        })}
      </TableRow>
    )
  })
}

export const RowOptions = ({ idx }: { idx: number }) => {
  const { open, setOpen } = useDropdownMenuContext()
  const [dropOpen, setDropOpen] = React.useState(false)

  return (
    <>
      {/* NOTE: THE MAIN TEST*/}
      <DropdownMenuView
        open={dropOpen}
        onOpenChange={setDropOpen}
        modal={false}
        trigger={{
          variant: 'ghost',
          size: 'sm',
          icon: <Ellipsis />,
          className: 'px-1 py-0 h-auto [&>div>span]:sr-only',
          command: {
            label: '⌘+k',
            key: 'Alt+p',
            action: () => {
              setDropOpen(true)
            },
          },
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
                <Button variant="default" onClick={() => toast.success('Goal updated!')}>
                  Submit
                </Button>
              ),
            },
            _cancel: { children: <Button variant="outline">Cancel</Button> },
          },
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
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                className={cn(
                  buttonVariants({
                    variant: 'secondary',
                    size: 'sm',
                    border: 'secondary',
                    className: 'px-8',
                  }),
                )}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className={cn(
                  buttonVariants({
                    variant: 'destructive',
                    size: 'sm',
                    border: 'destructive',
                    className: 'px-8',
                  }),
                )}>
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
      command: {
        label: '⌘+o+k',
        key: 'Alt+o',
      },
    },
    {
      children: 'Delete',
      actionType: 'dialog',
      icon: <Trash2 />,
      command: {
        label: '⌘+o+d',
        key: 'Alt+n',
      },
      className: 'bg-destructive/40 dark:text-white/70 text-destructive hover:!bg-destructive hover:!text-white',
    },
  ] as DropdownMenuOptionsDataType[]
}
