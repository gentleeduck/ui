import { filtersData, PriorityType, StatusType, TableDataType } from '@/registry/default/example/TableAdvancedDemo'
import { ComboboxType, OnSelectType } from '@/registry/default/ui'
import {
  DuckTableFilter,
  DuckTableHeader,
  DuckTableProvider,
  DuckTableSearch,
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
} from 'lucide-react'

export default function Table1Demo() {
  return (
    <>
      <DuckTableProvider>
        <DuckTableHeader>
          <DuckTableSearch
            input={{
              trigger: {
                placeholder: 'Search...',
              },
            }}
          />
          <DuckTableFilter filter={combinedFiltersData} />
        </DuckTableHeader>
        content
      </DuckTableProvider>
    </>
  )
}

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
    filter =>
      ({
        ...filter,
        type: 'combobox',
        onSelect: filter.onSelect,
      }) as ComboboxType<StatusType | PriorityType, keyof TableDataType>
  ),
  ...filtersDataForPriorityType.map(
    filter =>
      ({
        ...filter,
        type: 'combobox',
        onSelect: filter.onSelect,
      }) as ComboboxType<StatusType | PriorityType, keyof TableDataType>
  ),
]
