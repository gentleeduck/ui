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
  Settings,
  Sun,
  User,
} from 'lucide-react'
import {
  DropdownMenuOptionsDataType,
  DropdownMenuView,
} from '@/registry/registry-ui-components/dropdown-menu/dropdown-menu-wrapper'
import { toast } from 'sonner'

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
                  <div className="flex items-center justify-between gap-4">
                    <Component />
                    {idx === Array.from(tableColumns.values()).length - 1 && (
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
                            optionsData: menuItems,
                            group: [4, 1], // First 3 items in group 1, next 2 in group 2
                          },
                          className: 'min-w-[180px]',
                        }}
                        wrapper={{ modal: true }}
                      />
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
const menuItems: DropdownMenuOptionsDataType[] = [
  // Label type with icon and command
  {
    children: 'Profile',
    checked: true,
    icon: <User />,
    command: { label: '⌘P', action: () => console.log('Profile opened') },
    action: (e, { id }) => console.log(`Profile ${id} clicked`),
  },
  {
    children: 'Theme',
    icon: <Sun />,
    nestedData: {
      itemType: 'checkbox',
      optionsData: [
        {
          checked: true,
          children: 'Light',
          onClick: () => console.log('Profile opened'),
          command: {
            label: '⌘M',
            key: 'CTRL+m',
            action: () => toast.info('Profile opened'),
          },
          value: 'light',
          icon: <Sun />,
        },
        {
          children: 'Dark',
          value: 'dark',
          command: { label: '⌘D', action: () => console.log('Profile opened') },
          icon: <Moon />,
        },
        {
          children: 'System',
          value: 'system',
          command: {
            label: '⌘SM',
            action: () => console.log('Profile opened'),
          },
          icon: <Laptop />,
        },
      ],
      group: [3],
    },
  },
  // Radio type with nested options
  {
    children: 'Sort By',
    icon: <ArrowUpDown />,
    nestedData: {
      itemType: 'radio',
      defaultValue: 'date',
      optionsData: [
        {
          checked: true,
          children: 'Date',
          value: 'date',
          command: {
            label: '⌘SD',
            action: () => console.log('Profile opened'),
          },
          icon: <Calendar />,
        },
        {
          children: 'Name',
          value: 'name',
          command: {
            label: '⌘SN',
            action: () => console.log('Profile opened'),
          },
          icon: <User />,
        },
      ],
      group: [2],
    },
  },
  // Simple action item
  {
    children: 'Settings',
    icon: <Settings />,
    command: { label: '⌘S', action: () => console.log('Settings opened') },
    action: (e, { id }) => console.log('Settings clicked'),
  },
  // Destructive action
  {
    children: 'Logout',
    icon: <LogOut />,
    className: 'text-red-600 hover:bg-red-50',
    action: () => console.log('Logout clicked'),
  },
]
