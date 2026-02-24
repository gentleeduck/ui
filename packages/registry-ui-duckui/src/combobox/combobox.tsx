import { cn } from '@gentleduck/libs/cn'
import { useDirection } from '@gentleduck/primitives/hooks/direction'
import React from 'react'
import { Badge } from '../badge'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { Separator } from '../separator'

export type ComboboxItemType = {
  label: string
  value: string
}

export type ComboboxProps<TData extends readonly ComboboxItemType[], TType extends 'single' | 'multiple' = 'single'> = {
  items: TData
  onValueChange?: TType extends 'single'
    ? (value: TData[number]['value']) => void
    : (value: TData[number]['value'][]) => void
  withSearch?: boolean
  showSelected?: boolean
  defaultValue?: TType extends 'single' ? TData[number]['value'] : TData[number]['value'][]
  value?: TType extends 'single' ? TData[number]['value'] : TData[number]['value'][]
  popover?: React.ComponentPropsWithoutRef<typeof Popover>
  popoverTrigger?: React.ComponentPropsWithoutRef<typeof Button>
  popoverContent?: React.ComponentPropsWithoutRef<typeof PopoverContent>
  command?: React.ComponentPropsWithoutRef<typeof Command>
  commandInput?: React.ComponentPropsWithoutRef<typeof CommandInput>
  commandTriggerPlaceholder?: string
  commandEmpty?: string
  children: (item: TData) => React.ReactNode
}

export function Combobox<TData extends readonly ComboboxItemType[], TType extends 'single' | 'multiple' = 'single'>({
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
}: ComboboxProps<TData, TType>) {
  const direction = useDirection((popover as { dir?: 'ltr' | 'rtl' } | undefined)?.dir)
  const MAX_SELECTION = 2
  const _value = value ?? defaultValue

  return (
    <Popover {...popover} dir={direction}>
      <PopoverTrigger asChild>
        <Button {...popoverTrigger} variant={popoverTrigger?.variant ?? 'dashed'}>
          {popoverTrigger?.children}
          {showSelected &&
            (_value ? (
              _value instanceof Array && _value.length ? (
                <>
                  <Separator orientation="vertical" />
                  <div className="flex gap-1">
                    {_value.length > MAX_SELECTION ? (
                      <Badge className="px-2 py-0.75 rounded-sm font-normal" variant={'secondary'}>
                        +{_value.length} Selected
                      </Badge>
                    ) : (
                      _value.map((item) => (
                        <Badge className="px-2 py-0.5 rounded-[3px] capitalize" key={item} variant={'secondary'}>
                          {item}
                        </Badge>
                      ))
                    )}
                  </div>
                </>
              ) : (
                _value
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
}

export function ComboxGroup({ children, ...props }: React.ComponentPropsWithoutRef<typeof CommandGroup>) {
  return <CommandGroup {...props}>{children}</CommandGroup>
}

type ComboboxItemProps<T extends ComboboxItemType> = Omit<
  React.ComponentPropsWithoutRef<typeof CommandItem>,
  'onSelect'
> & {
  item: T
  onSelect?: (value: T['value']) => void
  checked?: React.ComponentPropsWithoutRef<typeof Checkbox>['checked']
}

export function ComboboxItem<T extends ComboboxItemType>({ item, onSelect, checked, ...props }: ComboboxItemProps<T>) {
  return (
    <CommandItem
      onSelect={() => {
        onSelect?.(item.value)
      }}
      {...props}>
      <Checkbox checked={checked} className="border-foreground/50 pointer-events-none" id={item?.value} />
      {item?.label}
    </CommandItem>
  )
}
