import type { Event } from '@duck-docs/lib/events'
import type * as React from 'react'

export type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof import('@gentleduck/registry-ui-duckui/dropdown-menu').DropdownMenuTrigger
>

export type CopyWithClassNamesProps = DropdownMenuTriggerProps & {
  value: string
  classNames: string
  className?: string
}

export type CopyButtonProps = import('@gentleduck/registry-ui-duckui/button').ButtonProps & {
  value: string
  event?: Event['name']
}
