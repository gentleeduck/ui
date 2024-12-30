import { Combobox, CommandListGroupDataType, TooltipProvider } from '@/registry/default/ui'
import { Circle, CircleAlert, CircleCheck, CircleHelp, CircleMinus, CirclePlus } from 'lucide-react'
import React from 'react'

type DistrosType = 'Ubuntu' | 'Debian' | 'Fedora' | 'Arch Linux' | 'CentOS'
const linuxDistros: CommandListGroupDataType<DistrosType>[] = [
  {
    label: 'Ubuntu',
    element: {
      label: {
        children: '19',
      },
      icon: {
        children: CircleCheck,
        className: 'size-4 stroke-[1.5]',
      },

      children: 'Ubuntu',
    },
  },
  {
    label: 'Debian',
    element: {
      label: {
        children: '14',
      },
      icon: {
        children: CircleHelp,
        className: 'size-4 stroke-[1.5]',
      },
      children: 'Ubuntu',
    },
  },
  {
    label: 'Fedora',
    element: {
      label: {
        children: '26',
      },
      icon: {
        children: CircleAlert,
        className: 'size-4 stroke-[1.5]',
      },
      children: 'Ubuntu',
    },
  },
  {
    label: 'Arch Linux',
    element: {
      label: {
        children: '23',
      },

      icon: {
        children: CircleMinus,
        className: 'size-4 stroke-[1.5]',
      },
      children: 'Ubuntu',
    },
  },
  {
    label: 'CentOS',
    element: {
      label: {
        children: '42',
      },
      icon: {
        children: Circle,
        className: 'size-4 stroke-[1.5]',
      },
      children: 'Ubuntu',
    },
  },
]

export default function ComboboxMainDemo() {
  const [value, setValue] = React.useState<DistrosType[]>([])

  return (
    <TooltipProvider>
      <Combobox<string, DistrosType>
        type={'listbox'}
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
            label: '⌃+v',
            key: 'ctrl+v',
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
