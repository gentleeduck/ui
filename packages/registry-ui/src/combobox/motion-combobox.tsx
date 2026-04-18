'use client'

import { cn } from '@gentleduck/libs/cn'
import type { IDirection } from '@gentleduck/primitives/direction'
import { useDirection } from '@gentleduck/primitives/direction'
import React from 'react'
import { MotionBadge } from '../badge'
import { MotionButton } from '../button'
import { MotionCheckbox } from '../checkbox'
import { Command, CommandEmpty, CommandInput, CommandList, MotionCommandItem } from '../command'
import { MotionPopover, MotionPopoverContent, PopoverTrigger } from '../popover'
import { MotionSeparator } from '../separator'
import type { IComboboxItemProps, IComboboxItemType, IComboboxProps } from './combobox.types'

const MotionCombobox = React.forwardRef<
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
    const direction = useDirection(dir as IDirection.Kind)
    const MAX_SELECTION = 2
    const resolvedValue = value ?? defaultValue

    return (
      <MotionPopover {...popoverProps} dir={direction}>
        <PopoverTrigger asChild>
          <MotionButton ref={ref} {...popoverTrigger} variant={popoverTrigger?.variant ?? 'dashed'}>
            {popoverTrigger?.children}
            {showSelected &&
              (resolvedValue ? (
                Array.isArray(resolvedValue) && resolvedValue.length ? (
                  <>
                    <MotionSeparator orientation="vertical" />
                    <div className="flex gap-1">
                      {resolvedValue.length > MAX_SELECTION ? (
                        <MotionBadge className="rounded-sm px-2 py-0.75 font-normal" variant={'secondary'}>
                          +{resolvedValue.length} Selected
                        </MotionBadge>
                      ) : (
                        resolvedValue.map((item) => (
                          <MotionBadge
                            className="rounded-[3px] px-2 py-0.5 capitalize"
                            key={item}
                            variant={'secondary'}>
                            {item}
                          </MotionBadge>
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
          </MotionButton>
        </PopoverTrigger>
        <MotionPopoverContent
          {...popoverContent}
          dir={direction}
          className={cn('w-(--gentleduck-popover-trigger-width) p-0', popoverContent?.className)}>
          <Command {...command}>
            {withSearch && <CommandInput {...commandInput} className={cn('h-8 px-2 [&_svg]:size-4.5', commandInput)} />}
            <CommandList>
              {commandEmpty && <CommandEmpty>{commandEmpty}</CommandEmpty>}
              {children(items)}
            </CommandList>
          </Command>
        </MotionPopoverContent>
      </MotionPopover>
    )
  },
)
MotionCombobox.displayName = 'MotionCombobox'

const MotionComboboxItem = React.forwardRef<
  React.ComponentRef<typeof MotionCommandItem>,
  IComboboxItemProps<IComboboxItemType> & { index?: number }
>(({ item, onSelect, checked, index = 0, ...props }, ref) => {
  const handleSelect = React.useCallback(() => onSelect?.(item.value), [onSelect, item.value])
  return (
    <MotionCommandItem ref={ref} index={index} onSelect={handleSelect} {...props}>
      <MotionCheckbox
        aria-hidden="true"
        checked={checked}
        className="pointer-events-none border-foreground/50"
        tabIndex={-1}
      />
      {item?.label}
    </MotionCommandItem>
  )
})
MotionComboboxItem.displayName = 'MotionComboboxItem'

export { MotionCombobox, MotionComboboxItem }
