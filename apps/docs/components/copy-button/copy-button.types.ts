import { ButtonProps } from '@gentleduck/registry-ui-duckui/button'
import { DropdownMenuTrigger } from '@gentleduck/registry-ui-duckui/dropdown-menu'
import { Event } from '~/lib/events'
import { NpmCommands } from '~/types/unist'

export type DropdownMenuTriggerProps = typeof DropdownMenuTrigger

export interface CopyWithClassNamesProps extends DropdownMenuTriggerProps {
  value: string
  classNames: string
  className?: string
}

export interface CopyNpmCommandButtonProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger> {
  commands: Required<NpmCommands>
}
export interface CopyButtonProps extends ButtonProps {
  value: string
  event?: Event['name']
}
