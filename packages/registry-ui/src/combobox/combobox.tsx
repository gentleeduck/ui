'use client'

import { cn } from '@gentleduck/libs/cn'
import { useDirection } from '@gentleduck/primitives/direction'
import React from 'react'
import { Badge } from '../badge'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command'
import { toDirection } from '../direction/direction.libs'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { Separator } from '../separator'
import { COMBOBOX_MAX_SELECTION_BADGES } from './combobox.constants'
import type { IComboboxItemProps, IComboboxItemType, IComboboxProps } from './combobox.types'

const Combobox = React.forwardRef<
  HTMLButtonElement,
  IComboboxProps<readonly IComboboxItemType[], 'single' | 'multiple'>
>(
  (
    {
      value,
      defaultValue,
      items,
      command,
      commandInput,
      commandEmpty = 'Nothing found.',
      commandTriggerPlaceholder = 'Select item...',
      popover,
      popoverTrigger,
      popoverContent,
      withSearch = true,
      showSelected = true,
      children,
    },
    ref,
  ) => {
    const { dir, ...popoverProps } = popover ?? {}
    const direction = useDirection(toDirection(dir))
    const resolvedValue = value ?? defaultValue

    return (
      <Popover {...popoverProps} dir={direction}>
        <PopoverTrigger asChild>
          <Button ref={ref} {...popoverTrigger} variant={popoverTrigger?.['variant'] ?? 'dashed'}>
            {popoverTrigger?.['children']}
            {showSelected &&
              (resolvedValue ? (
                resolvedValue instanceof Array && resolvedValue.length ? (
                  <>
                    <Separator orientation="vertical" />
                    <div className="flex gap-1">
                      {resolvedValue.length > COMBOBOX_MAX_SELECTION_BADGES ? (
                        <Badge className="px-2 py-0.75 rounded-sm font-normal" variant={'secondary'}>
                          +{resolvedValue.length} Selected
                        </Badge>
                      ) : (
                        resolvedValue.map((item) => (
                          <Badge className="px-2 py-0.5 rounded-[3px] capitalize" key={item} variant={'secondary'}>
                            {item}
                          </Badge>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  resolvedValue
                )
              ) : (
                commandTriggerPlaceholder
              ))}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          {...popoverContent}
          dir={direction}
          className={cn('w-(--gentleduck-popover-trigger-width) p-0', popoverContent?.className)}>
          <Command {...command}>
            {withSearch && <CommandInput {...commandInput} className={cn('h-8 [&_svg]:size-4.5 px-2', commandInput)} />}
            <CommandList>
              {commandEmpty && <CommandEmpty>{commandEmpty}</CommandEmpty>}
              {children(items)}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)
Combobox.displayName = 'Combobox'

const ComboxGroup = React.forwardRef<
  React.ComponentRef<typeof CommandGroup>,
  React.ComponentPropsWithoutRef<typeof CommandGroup>
>(({ children, ...props }, ref) => {
  return (
    <CommandGroup ref={ref} {...props}>
      {children}
    </CommandGroup>
  )
})
ComboxGroup.displayName = 'ComboxGroup'

const ComboboxItem = React.forwardRef<React.ComponentRef<typeof CommandItem>, IComboboxItemProps<IComboboxItemType>>(
  ({ item, onSelect, checked, ...props }, ref) => {
    return (
      <CommandItem
        ref={ref}
        onSelect={() => {
          onSelect?.(item.value)
        }}
        {...props}>
        <Checkbox
          aria-hidden="true"
          checked={checked}
          className="border-foreground/50 pointer-events-none"
          tabIndex={-1}
        />
        {item?.label}
      </CommandItem>
    )
  },
)
ComboboxItem.displayName = 'ComboboxItem'

export { Combobox, ComboboxItem, ComboxGroup }
