import { groupArrays } from '@/lib/utils'
import { optionsData, PriorityType, StatusType, TableDataType, tableHeaderDropDown } from './asdf'
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
import { cn } from '@gentleduck/duck-libs/cn'
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

          <DuckTableBody<typeof tableData> data={tableData}>
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
    className: 'w-[130px]',
    sortable: false,
  },
  {
    label: 'title',
    className: 'w-[200px]',
    sortable: true,
    showLabel: false,
    dropdownMenuOptions: tableHeaderDropDown,
  },
  {
    label: 'label',
    className: 'w-[90px]',
    sortable: true,
    currentSort: 'not sorted',
    dropdownMenuOptions: tableHeaderDropDown,
  },
  {
    label: 'status',
    sortable: true,
    showLabel: true,
    className: 'w-[70px]',
    currentSort: 'not sorted',
    dropdownMenuOptions: tableHeaderDropDown,
  },
  {
    label: 'priority',
    sortable: true,
    dropdownMenuOptions: tableHeaderDropDown,
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
      icon: {
        children: Clock12,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Medium',

      icon: {
        children: ArrowRightIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-7878' },
    title: { children: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!' },
    label: { children: 'Documentation' },
    status: {
      children: 'Backlog',

      icon: {
        children: CircleHelp,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Medium',

      icon: {
        children: ArrowRightIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-7878' },
    title: { children: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!' },
    label: { children: 'Documentation' },
    status: {
      children: 'Backlog',

      icon: {
        children: CircleHelp,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Medium',

      icon: {
        children: ArrowRightIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-7839' },
    title: { children: 'We need to bypass the neural TCP card!' },
    label: { children: 'Bug' },
    status: {
      children: 'Todo',

      icon: {
        children: Circle,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'High',

      icon: {
        children: ArrowUpIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-5562' },
    title: {
      children: 'The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!',
    },
    label: { children: 'Feature' },
    status: {
      children: 'Backlog',

      icon: {
        children: CircleHelp,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Medium',

      icon: {
        children: ArrowRightIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-8686' },
    title: { children: "I'll parse the wireless SSL protocol, that should drive the API panel!" },
    label: { children: 'Feature' },
    status: {
      children: 'Canceled',
      icon: {
        children: CircleX,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Medium',

      icon: {
        children: ArrowRightIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-1280' },
    title: { children: 'Use the digital TLS panel, then you can transmit the haptic system!' },
    label: { children: 'Bug' },
    status: {
      children: 'Done',
      icon: {
        children: CircleCheck,
        className: 'size-4 stroke-[1.5]',
      },
    },

    priority: {
      children: 'High',

      icon: {
        children: ArrowUpIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-7262' },
    title: {
      children: 'The UTF8 application is down, parse the neural bandwidth so we can back up the PNG firewall!',
    },
    label: { children: 'Feature' },
    status: {
      children: 'Done',

      icon: {
        children: CircleCheck,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'High',

      icon: {
        children: ArrowUpIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-1138' },
    title: { children: "Generating the driver won't do anything, we need to quantify the 1080p SMTP bandwidth!" },
    label: { children: 'Feature' },
    status: {
      children: 'In Progress',

      icon: {
        children: Clock12,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Medium',

      icon: {
        children: ArrowRightIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-7184' },
    title: { children: 'We need to program the back-end THX pixel!' },
    label: { children: 'Feature' },
    status: {
      children: 'Todo',

      icon: {
        children: Circle,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Low',

      icon: {
        children: ArrowDownIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-5160' },
    title: { children: "Calculating the bus won't do anything, we need to navigate the back-end JSON protocol!" },
    label: { children: 'Documentation' },
    status: {
      children: 'In Progress',

      icon: {
        children: Clock12,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'High',

      icon: {
        children: ArrowUpIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-5618' },
    title: { children: "Generating the driver won't do anything, we need to index the online SSL application!" },
    label: { children: 'Documentation' },
    status: {
      children: 'Done',

      icon: {
        children: CircleCheck,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Medium',

      icon: {
        children: ArrowRightIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-6699' },
    title: { children: "I'll transmit the wireless JBOD capacitor, that should hard drive the SSD feed!" },
    label: { children: 'Documentation' },
    status: {
      children: 'Backlog',

      icon: {
        children: CircleHelp,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Medium',

      icon: {
        children: ArrowRightIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-2858' },
    title: { children: 'We need to overtake the online UDP bus!' },
    label: { children: 'Bug' },
    status: {
      children: 'Backlog',

      icon: {
        children: CircleHelp,
        className: 'size-4 stroke-[1.5]',
      },
    },

    priority: {
      children: 'Medium',

      icon: {
        children: ArrowRightIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-9864' },
    title: { children: "I'll reboot the 1080p FTP panel, that should matrix the HEX hard drive!" },
    label: { children: 'Bug' },
    status: {
      children: 'Done',

      icon: {
        children: CircleCheck,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'High',

      icon: {
        children: ArrowUpIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-8404' },
    title: { children: 'We need to generate the virtual HEX alarm!' },
    label: { children: 'Bug' },
    status: {
      children: 'In Progress',

      icon: {
        children: Clock12,
        className: 'size-4 stroke-[1.5]',
      },
    },

    priority: {
      children: 'Low',

      icon: {
        children: ArrowDownIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-5365' },
    title: { children: "Backing up the pixel won't do anything, we need to transmit the primary IB array!" },
    label: { children: 'Documentation' },
    status: {
      children: 'In Progress',

      icon: {
        children: Clock12,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Low',

      icon: {
        children: ArrowDownIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-1780' },
    title: { children: 'The CSS feed is down, index the bluetooth transmitter so we can compress the CLI protocol!' },
    label: { children: 'Documentation' },
    status: {
      children: 'Todo',

      icon: {
        children: Circle,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'High',

      icon: {
        children: ArrowUpIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-6938' },
    title: { children: 'Use the redundant SCSI application, then you can hack the optical alarm!' },
    label: { children: 'Documentation' },
    status: {
      children: 'Todo',

      icon: {
        children: Circle,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'High',

      icon: {
        children: ArrowUpIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-9885' },
    title: { children: 'We need to compress the auxiliary VGA driver!' },
    label: { children: 'Bug' },
    status: {
      children: 'Backlog',

      icon: {
        children: CircleHelp,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'High',

      icon: {
        children: ArrowUpIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-3216' },
    title: { children: "Transmitting the transmitter won't do anything, we need to compress the virtual HDD sensor!" },
    label: { children: 'Documentation' },
    status: {
      children: 'Backlog',

      icon: {
        children: CircleHelp,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Medium',

      icon: {
        children: ArrowRightIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-9285' },
    title: { children: 'The IP monitor is down, copy the haptic alarm so we can generate the HTTP transmitter!' },
    label: { children: 'Bug' },
    status: {
      children: 'Todo',

      icon: {
        children: Circle,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'High',

      icon: {
        children: ArrowUpIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-1024' },
    title: {
      children: "Overtaking the microchip won't do anything, we need to transmit the digital OCR transmitter!",
    },
    label: { children: 'Documentation' },
    status: {
      children: 'In Progress',

      icon: {
        children: Clock12,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Low',

      icon: {
        children: ArrowDownIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-7068' },
    title: { children: "You can't generate the capacitor without indexing the wireless HEX pixel!" },
    label: { children: 'Bug' },
    status: {
      children: 'Canceled',

      icon: {
        children: CircleX,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Low',

      icon: {
        children: ArrowDownIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-6502' },
    title: { children: "Navigating the microchip won't do anything, we need to bypass the back-end SQL bus!" },
    label: { children: 'Bug' },
    status: {
      children: 'Todo',

      icon: {
        children: Circle,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'High',
      icon: {
        children: ArrowUpIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-5326' },
    title: { children: 'We need to hack the redundant UTF8 transmitter!' },
    label: { children: 'Bug' },
    status: {
      children: 'Todo',

      icon: {
        children: Circle,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Low',

      icon: {
        children: ArrowDownIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
  {
    task: { children: 'TASK-6274' },
    title: { children: 'Use the virtual PCI circuit, then you can parse the bluetooth alarm!' },
    label: { children: 'Documentation' },
    status: {
      children: 'Canceled',

      icon: {
        children: CircleX,
        className: 'size-4 stroke-[1.5]',
      },
    },
    priority: {
      children: 'Low',
      icon: {
        children: ArrowDownIcon,
        className: 'size-4 stroke-[1.5]',
      },
    },
  },
]
