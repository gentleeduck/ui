import { Combobox, CommandListGroupDataType, TooltipProvider } from '@/registry/default/ui'
import { Circle, CircleAlert, CircleCheck, CircleHelp, CircleMinus, CirclePlus } from 'lucide-react'
import React from 'react'

type DistrosType = 'Ubuntu' | 'Debian' | 'Fedora' | 'Arch Linux' | 'CentOS'
const linuxDistros: CommandListGroupDataType<DistrosType>[] = [
  {
    label: 'Ubuntu',
    element: {
      children: 'Ubuntu',
    },
  },
  {
    label: 'Debian',
    element: {
      children: 'Debian',
    },
  },
  {
    label: 'Fedora',
    element: {
      children: 'Fedora',
    },
  },
  {
    label: 'Arch Linux',
    element: {
      children: 'Arch Linux',
    },
  },
  {
    label: 'CentOS',
    element: {
      children: 'CentOS',
    },
  },
]

export default function ComboboxMainDemo() {
  const [value, setValue] = React.useState<DistrosType[]>([])

  return (
    <TooltipProvider>
      <Combobox<string, DistrosType>
        type={'combobox'}
        trigger={{
          children: 'Status',
          className: '[&>div>span]:text-xs',
          icon: {
            children: CirclePlus,
            className: '!size-4 stroke-[1.5]',
          },
          label: {
            children: 'Select one',
            showLabel: true,
            side: 'top',
            showCommand: true,
          },
          command: {
            label: '⌃+m',
            key: 'Ctrl+m',
          },
        }}
        onSelect={{
          value: value,
          setValue: setValue,
        }}
        content={{
          showSearchInput: true,
          data: linuxDistros,
        }}
      />
    </TooltipProvider>
  )
}
