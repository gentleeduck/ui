import { DropdownMenuOptionsDataType, ComboboxType } from '../ui'
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
import { EyeNoneIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib'
import { log } from 'console'
import { TableContentDataType } from '@/registry/registry-ui-components/table'
import { columns, tableData } from './table-1'

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
    icon: {
      children: ArrowDownIcon,
      className: 'mr-2 h-3.5 w-3.5 text-muted-foreground/70',
    },
    children: 'Asc',
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
    icon: {
      children: ArrowUpIcon,
      className: 'mr-2 h-3.5 w-3.5 text-muted-foreground/70',
    },
    children: 'Desc',
  },
  {
    action: (e, { headers, column, setHeaders }) => {
      console.log('hi form action 3')

      setHeaders(headers.filter((sub) => sub !== column))
    },
    icon: {
      children: EyeNoneIcon as LucideIcon,
      className: 'mr-2 h-3.5 w-3.5 text-muted-foreground/70',
    },
    children: 'Hide',
  },
]

export type StatusType = 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled'
export type PriorityType = 'High' | 'Medium' | 'Low'
const iconStyle = 'size-4 stroke-[1.5] text-muted-foreground'
export const filtersData = [
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
              icon: ArrowRightIcon,
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
  } as ComboboxType<keyof TableDataType, PriorityType>,
]

export const optionsData: DropdownMenuOptionsDataType<TableHeaderOptionsType<TableDataType>, true>[] = [
  {
    children: 'Edit',
    onClick: () => console.log('edit'),
    icon: { children: Pencil },
  },
  {
    children: 'Share',
    icon: {
      children: Share2,
    },
    nestedData: {
      group: [2],
      defaultValue: 'Twitter',
      defaultChecked: true,
      itemType: 'radio',
      optionsData: [
        {
          className: '[&_svg]:text-[#1DA1F2]',
          value: 'Twitter',
          children: 'Twitter',
          icon: {
            children: Twitter,
          },
        },
        {
          command: {
            key: 'b',
            label: '⌘+e',
          },
          icon: {
            children: Twitch,
          },
          className: '[&_svg]:text-[#6441a5]',
          value: 'Twitch',
          children: 'Twitch',
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
    command: { label: '⌘⌫', key: 'a' },
    icon: {
      children: Trash2,
    },
    className: '[&_span]:text-red-500 text-red-500 [&_span]:hover:text-primary',
  },
]

export default function DataTableMainDemo() {
  return (
    <>
      <TableCustomView<true, TableDataType, StatusType | PriorityType>
        wrapper={{
          className: cn('lg:w-[632px] ldg:w-[524px] w-[270px] m-auto'),
        }}
        table={{
          className: cn('lg:w-[632px] lig:w-[524px] w-[270px]  h-[351px]'),
        }}
        header={columns}
        selection={true}
        filters={filtersData as ComboboxType<keyof TableDataType, StatusType | PriorityType>[]}
        tableContentData={[...tableData]}
        viewButton={true}
        tableSearch={true}
        pagination={{
          groupSize: 6,
          showSelectCount: true,
          showPageCount: true,
          showGroup: true,
          showNavigation: true,
        }}
        contextMenu={{
          group: [3, 1],
          optionsData: optionsData,
        }}
        dropdownMenu={{
          group: [3, 1],
          optionsData: optionsData,
        }}
      />
    </>
  )
}
