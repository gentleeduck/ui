import { Circle, CircleAlert, CircleCheck, CircleHelp, CircleMinus, CirclePlus } from 'lucide-react'
import React from 'react'
import { Combobox, CommandListGroupDataType, TooltipProvider } from '@/registry/default/ui'

type DistrosType = 'Ubuntu' | 'Debian' | 'Fedora' | 'Arch Linux' | 'CentOS'
const linuxDistros: CommandListGroupDataType<DistrosType>[] = [
  {
    element: {

      children: 'Ubuntu',
      icon: {
        children: CircleCheck,
        className: 'size-4 stroke-[1.5]',
      },
      label: {
        children: '19',
      },
    },
    label: 'Ubuntu',
  },
  {
    element: {
      children: 'Ubuntu',
      icon: {
        children: CircleHelp,
        className: 'size-4 stroke-[1.5]',
      },
      label: {
        children: '14',
      },
    },
    label: 'Debian',
  },
  {
    element: {
      children: 'Ubuntu',
      icon: {
        children: CircleAlert,
        className: 'size-4 stroke-[1.5]',
      },
      label: {
        children: '26',
      },
    },
    label: 'Fedora',
  },
  {
    element: {
      children: 'Ubuntu',

      icon: {
        children: CircleMinus,
        className: 'size-4 stroke-[1.5]',
      },
      label: {
        children: '23',
      },
    },
    label: 'Arch Linux',
  },
  {
    element: {
      children: 'Ubuntu',
      icon: {
        children: Circle,
        className: 'size-4 stroke-[1.5]',
      },
      label: {
        children: '42',
      },
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
            key: 'ctrl+v',
            label: '⌃+v',
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
        type={'listbox'}
      />
    </TooltipProvider>
  )
}
