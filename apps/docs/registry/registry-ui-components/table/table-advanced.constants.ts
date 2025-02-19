import { ArrowDownIcon, ArrowUpIcon, EyeOff } from 'lucide-react'
import { TableColumnSortableType } from './table-advanced.types'

export const dropdownMenuOptions: TableColumnSortableType[] = [
  {
    icon: {
      children: ArrowDownIcon,
      className: 'mr-2 text-muted-foreground/80',
    },
    children: 'asc',
    variant: 'ghost',
    size: 'sm',
  },

  {
    icon: {
      children: ArrowUpIcon,
      className: 'mr-2 text-muted-foreground/80',
    },
    children: 'desc',
    variant: 'ghost',
    size: 'sm',
  },
  {
    icon: {
      children: EyeOff,
      className: 'mr-2 text-muted-foreground/80',
    },
    children: 'hide',
    variant: 'ghost',
    size: 'sm',
  },
]
