import type { ButtonProps } from '@gentleduck/registry-ui-duckui/button'
import type { DropdownMenuTrigger } from '@gentleduck/registry-ui-duckui/dropdown-menu'
import type { Event } from '@duck-docs/lib/events'

export type DropdownMenuTriggerProps = typeof DropdownMenuTrigger

export interface CopyWithClassNamesProps extends DropdownMenuTriggerProps {
  value: string
  classNames: string
  className?: string
}

export interface CopyButtonProps extends ButtonProps {
  value: string
  event?: Event['name']
}
