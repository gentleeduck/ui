import { cn } from '@/lib'
import { groupArrays } from '@/lib/utils'
import {
  optionsData,
  PriorityType,
  StatusType,
  TableDataType,
  tableHeaderDropDown,
} from '@/registry/default/example/TableAdvancedDemo'
import {
  Checkbox,
  ComboboxType,
  ContextContent,
  ContextMenuLabel,
  ContextMenuOptionsType,
  DropdownMenuOptionsDataType,
  DropdownMenuView,
} from '@/registry/default/ui'
import {
  DuckTableFilter,
  DuckTableBarRightSide,
  DuckTableProvider,
  DuckTableSearch,
  TableBarViewButton,
  TableHeaderType,
  DuckTableBarLeftSide,
  DuckTableHeader,
  DuckTableBar,
  DuckTable,
  TableBody,
  DuckTableBodyRow,
  TableContentDataType,
  TableCell,
  TableHeaderOptionsType,
  DuckTableBody,
  DuckTableFooter,
  FooterColumnType,
  DuckTableDownBar,
  DuckTablePagination,
} from '@/registry/registry-ui-components/table'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  Circle,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock12,
  Ellipsis,
} from 'lucide-react'
import React from 'react'

export default function Table1Demo() {
  return (
    <>
      <DuckTableProvider>
        <DuckTableBar>
          <DuckTableBarRightSide>
            <DuckTableSearch
              input={{
                trigger: {
                  placeholder: 'Search...',
                },
              }}
            />
            <DuckTableFilter filter={combinedFiltersData} />
          </DuckTableBarRightSide>
          <DuckTableBarLeftSide>
            <TableBarViewButton header={columns} />
          </DuckTableBarLeftSide>
        </DuckTableBar>
        <DuckTable>
          <DuckTableHeader headers={columns} selectable={true} />

          <DuckTableBody<(typeof tableData)[number]> data={tableData}>
            {(data) =>
              data.map((row, idx) => {
                return (
                  <DuckTableRowWrapper
                    key={idx}
                    options={{
                      group: [3, 1],
                      optionsData: optionsData,
                    }}
                    row={row}
                  />
                )
              })
            }
          </DuckTableBody>
          <DuckTableFooter columns={footerColumns} />
        </DuckTable>
        <DuckTableDownBar>
          <DuckTablePagination />
        </DuckTableDownBar>
      </DuckTableProvider>
    </>
  )
}

export const DuckTableRowWrapper = ({
  row,
  options,
}: {
  row: TableContentDataType<TableDataType>
  options: ContextMenuOptionsType<Record<string, unknown>> | undefined
}) => {
  return (
    <DuckTableBodyRow
      content={{
        options,
      }}
      row={{
        children: (
          <>
            {Object.values(row).map((item, idx) => {
              const { children, icon, ...props } = item ?? {}
              const { children: Icon, ...iconProps } = icon ?? {}

              return (
                <React.Fragment>
                  {/*NOTE: Rendering Checkbox */}
                  {idx === 0 && (
                    <TableCell key={idx} {...props}>
                      <Checkbox className="border-border" />
                    </TableCell>
                  )}
                  <TableCell key={idx} {...props}>
                    <div className="flex items-center gap-4 justify-between">
                      {/*NOTE: Rendering Label */}

                      {/*NOTE: Rendering the row column childrend */}
                      <div className="grid [&_*]:text-ellipsis [&_*]:overflow-hidden [&_*]:whitespace-nowrap">
                        <span className={cn(Icon && 'flex items-center gap-2 [&_svg]:flex-shrink-0')}>
                          {Icon && <Icon {...iconProps} />}
                          {Icon ? <span> {children}</span> : children}
                        </span>
                      </div>
                      {/*NOTE: Dropdown Menu */}
                      {idx === Object.values(row).length - 1 && optionsData?.length && (
                        <DropdownMenuView
                          trigger={{
                            className: 'flex h-8 w-8 p-0 data-[state=open]:bg-muted',
                            children: <span className="sr-only">Open menu</span>,
                            variant: 'ghost',
                            size: 'icon',
                            icon: {
                              children: Ellipsis,
                              className: 'h-4 w-4',
                            },
                          }}
                          content={{
                            align: 'end',
                            options,
                          }}
                        />
                      )}
                    </div>
                  </TableCell>
                </React.Fragment>
              )
            })}
          </>
        ),
      }}></DuckTableBodyRow>
  )
}

const footerColumns: FooterColumnType[] = [
  {
    children: 'Total',
    colSpan: 3,
  },
  {
    children: '50000$',
    colSpan: 3,
    className: 'w-full text-end',
  },
]

const iconStyle = 'size-4 stroke-[1.5] text-muted-foreground'
// Assuming you have separate filter arrays for StatusType and PriorityType
const filtersDataForStatusType: ComboboxType<keyof TableDataType, StatusType>[] = [
  {
    type: 'listbox',
    trigger: {
      children: 'status',
      label: {
        children: 'Filter Status',
        showLabel: true,
        showCommand: true,
        side: 'top',
      },
      command: {
        label: '⌃+⇧+S',
        key: 'ctrl+shift+s',
      },
    },
    content: {
      showSearchInput: true,
      data: [
        {
          label: 'Backlog',
          element: {
            icon: {
              children: CircleHelp,
              className: iconStyle,
            },
          },
        },
        {
          label: 'Todo',
          element: {
            icon: {
              children: Circle,
              className: iconStyle,
            },
          },
        },
        {
          label: 'In Progress',
          element: {
            icon: {
              children: Clock12,
              className: iconStyle,
            },
          },
        },
        {
          label: 'Done',
          element: {
            icon: {
              children: CircleCheck,
              className: iconStyle,
            },
          },
        },
        {
          label: 'Canceled',
          element: {
            icon: {
              children: CircleX,
              className: iconStyle,
            },
          },
        },
      ],
    },
  },
]

const filtersDataForPriorityType: ComboboxType<keyof TableDataType, PriorityType>[] = [
  {
    type: 'listbox',
    trigger: {
      children: 'priority',
      label: {
        children: 'Filter Method',
        showLabel: true,
        showCommand: true,
        side: 'top',
      },
      command: {
        label: '⌃+⇧+M',
        key: 'ctrl+shift+m',
      },
    },
    content: {
      showSearchInput: true,
      data: [
        {
          label: 'Low',
          element: {
            icon: {
              children: ArrowDownIcon,
              className: 'size-4 stroke-[1.5]',
            },
          },
        },
        {
          label: 'Medium',
          element: {
            icon: {
              children: ArrowRightIcon,
              className: 'size-4 stroke-[1.5]',
            },
          },
        },
        {
          label: 'High',
          element: {
            icon: {
              children: ArrowUpIcon,
              className: 'size-4 stroke-[1.5]',
            },
          },
        },
      ],
    },
  },
]

const combinedFiltersData = [
  ...filtersDataForStatusType.map(
    (filter) =>
      ({
        ...filter,
        type: 'combobox',
        onSelect: filter.onSelect,
      }) as ComboboxType<StatusType | PriorityType, keyof TableDataType>,
  ),
  ...filtersDataForPriorityType.map(
    (filter) =>
      ({
        ...filter,
        type: 'combobox',
        onSelect: filter.onSelect,
      }) as ComboboxType<StatusType | PriorityType, keyof TableDataType>,
  ),
]

const columns: TableHeaderType<TableDataType>[] = [
  {
    label: 'task',
    className: 'w-[110px]',
    sortable: false,
  },
  {
    label: 'title',
    className: 'w-[200px]',
    sortable: true,
    showLabel: false,
  },
  {
    label: 'label',
    className: 'w-[90px]',
    sortable: true,
  },
  {
    label: 'status',
    sortable: true,
    showLabel: true,
    className: 'w-[70px]',
  },
  {
    label: 'priority',
    sortable: true,
  },
]

export const tableData: TableContentDataType<TableDataType>[] = [
  {
    task: { children: 'TASK-8782' },
    title: {
      children: <p> You can't compress the program without quantifying the open-source SSD pixel! </p>,
    },
    label: { children: 'Documentation' },
    status: {
      children: 'In Progress',
      icon: <Clock12 className="size-4 stroke-[1.5]" />,
    },
    priority: {
      children: 'Medium',
      icon: <ArrowRightIcon className="size-4 stroke-[1.5]" />,
    },
  },
  {
    task: { children: 'TASK-7878' },
    title: {
      children: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!',
    },
    label: { children: 'Documentation' },
    status: {
      children: 'Backlog',
      icon: <CircleHelp className="size-4 stroke-[1.5]" />,
    },
    priority: {
      children: 'Medium',
      icon: <ArrowRightIcon className="size-4 stroke-[1.5]" />,
    },
  },
]
