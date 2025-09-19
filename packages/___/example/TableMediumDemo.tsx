import { Pencil, Share2, Star, Trash2, Twitch, Twitter } from 'lucide-react'
import { cn } from '@/lib'
import {
  DropdownMenuOptionsDataType,
  TableContentDataType,
  TableCustomView,
  TableHeaderOptionsType,
  TableHeaderType,
} from '../ui'

export type TableDataType = {
  task: React.ReactNode | string
  title: React.ReactNode | string
  label: React.ReactNode | string
  status: StatusType
  priority: PriorityType
}

const columns: TableHeaderType<true, TableDataType>[] = [
  {
    label: 'task',
  },
  {
    className: 'w-[110px]',
    label: 'title',
  },
  {
    className: 'w-[90px]',
    label: 'label',
  },
  {
    className: 'w-[70px]',
    label: 'status',
  },
  {
    label: 'priority',
  },
]

export type StatusType = 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled'
export type PriorityType = 'High' | 'Medium' | 'Low'

const optionsData: DropdownMenuOptionsDataType<TableHeaderOptionsType<TableDataType>, true>[] = [
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
      group: [2],
      optionsData: [
        {
          children: 'Twitter',
          className: '[&_svg]:text-[#1DA1F2]',
          icon: {
            children: Twitter,
          },
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
        dropdownMenu={{
          group: [3, 1],
          optionsData: optionsData,
        }}
        header={columns}
        table={{
          className: cn('lg:w-[632px] lig:w-[524px] w-[270px]  h-[351px]'),
        }}
        tableContentData={[...tableData]}
        tableSearch={true}
        wrapper={{
          className: cn('lg:w-[632px] ldg:w-[524px] w-[270px] m-auto'),
        }}
      />
    </>
  )
}

export const tableData: TableContentDataType<TableDataType>[] = [
  {
    label: { children: 'Documentation' },
    priority: { children: 'Medium' },
    status: { children: 'In Progress' },
    task: { children: 'TASK-8782' },
    title: {
      children: <p> You can't compress the program without quantifying the open-source SSD pixel! </p>,
    },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'Medium' },
    status: { children: 'Backlog' },
    task: { children: 'TASK-7878' },
    title: { children: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!' },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'Medium' },
    status: { children: 'Backlog' },
    task: { children: 'TASK-7878' },
    title: { children: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!' },
  },
  {
    label: { children: 'Bug' },
    priority: { children: 'High' },
    status: { children: 'Todo' },
    task: { children: 'TASK-7839' },
    title: { children: 'We need to bypass the neural TCP card!' },
  },
  {
    label: { children: 'Feature' },
    priority: { children: 'Medium' },
    status: { children: 'Backlog' },
    task: { children: 'TASK-5562' },
    title: {
      children: 'The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!',
    },
  },
  {
    label: { children: 'Feature' },
    priority: { children: 'Medium' },
    status: { children: 'Canceled' },
    task: { children: 'TASK-8686' },
    title: { children: "I'll parse the wireless SSL protocol, that should drive the API panel!" },
  },
  {
    label: { children: 'Bug' },
    priority: { children: 'High' },
    status: { children: 'Done' },
    task: { children: 'TASK-1280' },
    title: { children: 'Use the digital TLS panel, then you can transmit the haptic system!' },
  },
  {
    label: { children: 'Feature' },
    priority: { children: 'High' },
    status: { children: 'Done' },
    task: { children: 'TASK-7262' },
    title: {
      children: 'The UTF8 application is down, parse the neural bandwidth so we can back up the PNG firewall!',
    },
  },
  {
    label: { children: 'Feature' },
    priority: { children: 'Medium' },
    status: { children: 'In Progress' },
    task: { children: 'TASK-1138' },
    title: { children: "Generating the driver won't do anything, we need to quantify the 1080p SMTP bandwidth!" },
  },
  {
    label: { children: 'Feature' },
    priority: { children: 'Low' },
    status: { children: 'Todo' },
    task: { children: 'TASK-7184' },
    title: { children: 'We need to program the back-end THX pixel!' },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'High' },
    status: { children: 'In Progress' },
    task: { children: 'TASK-5160' },
    title: { children: "Calculating the bus won't do anything, we need to navigate the back-end JSON protocol!" },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'Medium' },
    status: { children: 'Done' },
    task: { children: 'TASK-5618' },
    title: { children: "Generating the driver won't do anything, we need to index the online SSL application!" },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'Medium' },
    status: { children: 'Backlog' },
    task: { children: 'TASK-6699' },
    title: { children: "I'll transmit the wireless JBOD capacitor, that should hard drive the SSD feed!" },
  },
  {
    label: { children: 'Bug' },
    priority: { children: 'Medium' },
    status: { children: 'Backlog' },
    task: { children: 'TASK-2858' },
    title: { children: 'We need to overtake the online UDP bus!' },
  },
  {
    label: { children: 'Bug' },
    priority: { children: 'High' },
    status: { children: 'Done' },
    task: { children: 'TASK-9864' },
    title: { children: "I'll reboot the 1080p FTP panel, that should matrix the HEX hard drive!" },
  },
  {
    label: { children: 'Bug' },
    priority: { children: 'Low' },
    status: { children: 'In Progress' },
    task: { children: 'TASK-8404' },
    title: { children: 'We need to generate the virtual HEX alarm!' },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'Low' },
    status: { children: 'In Progress' },
    task: { children: 'TASK-5365' },
    title: { children: "Backing up the pixel won't do anything, we need to transmit the primary IB array!" },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'High' },
    status: { children: 'Todo' },
    task: { children: 'TASK-1780' },
    title: { children: 'The CSS feed is down, index the bluetooth transmitter so we can compress the CLI protocol!' },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'High' },
    status: { children: 'Todo' },
    task: { children: 'TASK-6938' },
    title: { children: 'Use the redundant SCSI application, then you can hack the optical alarm!' },
  },
  {
    label: { children: 'Bug' },
    priority: { children: 'High' },
    status: { children: 'Backlog' },
    task: { children: 'TASK-9885' },
    title: { children: 'We need to compress the auxiliary VGA driver!' },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'Medium' },
    status: { children: 'Backlog' },
    task: { children: 'TASK-3216' },
    title: { children: "Transmitting the transmitter won't do anything, we need to compress the virtual HDD sensor!" },
  },
  {
    label: { children: 'Bug' },
    priority: { children: 'High' },
    status: { children: 'Todo' },
    task: { children: 'TASK-9285' },
    title: { children: 'The IP monitor is down, copy the haptic alarm so we can generate the HTTP transmitter!' },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'Low' },
    status: { children: 'In Progress' },
    task: { children: 'TASK-1024' },
    title: {
      children: "Overtaking the microchip won't do anything, we need to transmit the digital OCR transmitter!",
    },
  },
  {
    label: { children: 'Bug' },
    priority: { children: 'Low' },
    status: { children: 'Canceled' },
    task: { children: 'TASK-7068' },
    title: { children: "You can't generate the capacitor without indexing the wireless HEX pixel!" },
  },
  {
    label: { children: 'Bug' },
    priority: { children: 'High' },
    status: { children: 'Todo' },
    task: { children: 'TASK-6502' },
    title: { children: "Navigating the microchip won't do anything, we need to bypass the back-end SQL bus!" },
  },
  {
    label: { children: 'Bug' },
    priority: { children: 'Low' },
    status: { children: 'Todo' },
    task: { children: 'TASK-5326' },
    title: { children: 'We need to hack the redundant UTF8 transmitter!' },
  },
  {
    label: { children: 'Documentation' },
    priority: { children: 'Low' },
    status: { children: 'Canceled' },
    task: { children: 'TASK-6274' },
    title: { children: 'Use the virtual PCI circuit, then you can parse the bluetooth alarm!' },
  },
]
