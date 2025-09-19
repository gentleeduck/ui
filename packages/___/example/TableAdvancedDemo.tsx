import { EyeNoneIcon } from '@radix-ui/react-icons'
import { log } from 'console'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  Circle,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock12,
  LucideIcon,
  Pencil,
  Share2,
  Star,
  Trash2,
  Twitch,
  Twitter,
} from 'lucide-react'
import { cn } from '@/lib'
import { TableContentDataType } from '@/registry/registry-ui-components/table'
import { ComboboxType, DropdownMenuOptionsDataType } from '../ui'

export type TableDataType = {
  task: React.ReactNode | string
  title: React.ReactNode | string
  label: React.ReactNode | string
  status: StatusType
  priority: PriorityType
}

export const tableHeaderDropDown: DropdownMenuOptionsDataType<TableHeaderOptionsType<TableDataType>, true>[] = [
  {
    action: (e, { sortArray, setHeaders, setTableData, data, headers, idx }) => {
      const { sortedData, updatedColumns } = sortArray(headers, data, headers[idx].label as keyof TableDataType, 'asc')
      // console.log(sortedData)
      setHeaders(() => updatedColumns)
      setTableData(() => (updatedColumns[idx].currentSort === 'asc' ? sortedData : data))
    },
  },
  {
    action: (e, { sortArray, setHeaders, setTableData, data, headers, idx }) => {
      const { sortedData, updatedColumns } = sortArray(
        headers,
        data,
        Object.keys(data[0])[idx] as keyof TableDataType,
        'desc',
      )
      setHeaders(() => updatedColumns)
      setTableData(() => (updatedColumns[idx].currentSort === 'desc' ? sortedData : data))
    },
    children: 'Desc',
    icon: {
      children: ArrowUpIcon,
      className: 'mr-2 h-3.5 w-3.5 text-muted-foreground/70',
    },
  },
  {
    action: (e, { headers, column, setHeaders }) => {
      console.log('hi form action 3')

      setHeaders(headers.filter((sub) => sub !== column))
    },
    children: 'Hide',
    icon: {
      children: EyeNoneIcon as LucideIcon,
      className: 'mr-2 h-3.5 w-3.5 text-muted-foreground/70',
    },
  },
]

export type StatusType = 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled'
export type PriorityType = 'High' | 'Medium' | 'Low'
const iconStyle = 'size-4 stroke-[1.5] text-muted-foreground'
export const filtersData = [
  {
    content: {
      data: [
        {
          element: {
            icon: {
              children: ArrowDownIcon,
              className: 'size-4 stroke-[1.5]',
            },
          },
          label: 'Low',
        },
        {
          element: {
            icon: {
              className: 'size-4 stroke-[1.5]',
              icon: ArrowRightIcon,
            },
          },
          label: 'Medium',
        },
        {
          element: {
            icon: {
              children: ArrowUpIcon,
              className: 'size-4 stroke-[1.5]',
            },
          },
          label: 'High',
        },
      ],
      showSearchInput: true,
    },
    trigger: {
      children: 'priority',
      command: {
        key: 'ctrl+shift+m',
        label: '⌃+⇧+M',
      },
      label: {
        children: 'Filter Method',
        showCommand: true,
        showLabel: true,
        side: 'top',
      },
    },
    type: 'listbox',
  } as ComboboxType<keyof TableDataType, PriorityType>,
]

export const optionsData: DropdownMenuOptionsDataType<TableHeaderOptionsType<TableDataType>, true>[] = [
  {
    children: 'Edit',
    icon: { children: Pencil },
    onClick: () => console.log('edit'),
  },
  {
    children: 'Share',
    icon: {
      children: Share2,
    },
    nestedData: {
      defaultChecked: true,
      defaultValue: 'Twitter',
      group: [2],
      itemType: 'radio',
      optionsData: [
        {
          children: 'Twitter',
          className: '[&_svg]:text-[#1DA1F2]',
          icon: {
            children: Twitter,
          },
          value: 'Twitter',
        },
        {
          children: 'Twitch',
          className: '[&_svg]:text-[#6441a5]',
          command: {
            key: 'b',
            label: '⌘+e',
          },
          icon: {
            children: Twitch,
          },
          value: 'Twitch',
        },
      ],
    },
  },
  {
    children: 'Favorite',
    icon: {
      children: Star,
    },
  },
  {
    children: 'Delete',
    className: '[&_span]:text-red-500 text-red-500 [&_span]:hover:text-primary',
    command: { key: 'a', label: '⌘⌫' },
    icon: {
      children: Trash2,
    },
  },
]

export default function DataTableMainDemo() {
  return (
    <>
      <TableCustomView<true, TableDataType, StatusType | PriorityType>
        contextMenu={{
          group: [3, 1],
          optionsData: optionsData,
        }}
        dropdownMenu={{
          group: [3, 1],
          optionsData: optionsData,
        }}
        filters={filtersData as ComboboxType<keyof TableDataType, StatusType | PriorityType>[]}
        header={columns}
        pagination={{
          groupSize: 6,
          showGroup: true,
          showNavigation: true,
          showPageCount: true,
          showSelectCount: true,
        }}
        selection={true}
        table={{
          className: cn('lg:w-[632px] lig:w-[524px] w-[270px]  h-[351px]'),
        }}
        tableContentData={[...tableData]}
        tableSearch={true}
        viewButton={true}
        wrapper={{
          className: cn('lg:w-[632px] ldg:w-[524px] w-[270px] m-auto'),
        }}
      />
    </>
  )
}
