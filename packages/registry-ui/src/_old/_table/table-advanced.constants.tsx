import { ArrowDownIcon, ArrowUpIcon, EyeOff } from 'lucide-react'
import { TableColumnSortableType } from './table-advanced.types'

export const dropdownMenuOptions: TableColumnSortableType[] = [
  {
    children: 'ascending',
    icon: <ArrowDownIcon className="mr-2 text-muted-foreground/80" />,
    size: 'sm',
    variant: 'ghost',
  },

  {
    children: 'descending',
    icon: <ArrowUpIcon className="mr-2 text-muted-foreground/80" />,
    size: 'sm',
    variant: 'ghost',
  },
  {
    children: 'hide' as 'other',
    icon: <EyeOff className="mr-2 text-muted-foreground/80" />,
    size: 'sm',
    variant: 'ghost',
  },
]
