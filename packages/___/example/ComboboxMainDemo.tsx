import { Circle, CircleAlert, CircleCheck, CircleHelp, CircleMinus, CirclePlus } from 'lucide-react'
import React from 'react'
import { Combobox, CommandListGroupDataType, TooltipProvider } from '@/registry/default/ui'

type DistrosType = 'Ubuntu' | 'Debian' | 'Fedora' | 'Arch Linux' | 'CentOS'
const linuxDistros: CommandListGroupDataType<DistrosType>[] = [
  {
    element: {
      children: 'Ubuntu',
    },
    label: 'Ubuntu',
  },
  {
    element: {
      children: 'Debian',
    },
    label: 'Debian',
  },
  {
    element: {
      children: 'Fedora',
    },
    label: 'Fedora',
  },
  {
    element: {
      children: 'Arch Linux',
    },
    label: 'Arch Linux',
  },
  {
    element: {
      children: 'CentOS',
    },
    label: 'CentOS',
  },
]

export default function ComboboxMainDemo() {
  const [value, setValue] = React.useState<DistrosType[]>([])

  return (
    <TooltipProvider>
      <Combobox<string, DistrosType>
        content={{
          data: linuxDistros,
          showSearchInput: true,
        }}
        onSelect={{
          setValue: setValue,
          value: value,
        }}
        trigger={{
          children: 'Status',
          className: '[&>div>span]:text-xs',
          command: {
            key: 'Ctrl+m',
            label: '⌃+m',
          },
          icon: {
            children: CirclePlus,
            className: '!size-4 stroke-[1.5]',
          },
          label: {
            children: 'Select one',
            showCommand: true,
            showLabel: true,
            side: 'top',
          },
        }}
        type={'combobox'}
      />
    </TooltipProvider>
  )
}
