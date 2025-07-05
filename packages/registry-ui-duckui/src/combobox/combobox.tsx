import { cn } from '@gentleduck/libs/cn'
import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

export type ComboboxItemType = {
  label: string
  value: string
}

export type ComboboxProps<T extends readonly ComboboxItemType[] | ComboboxItemType[]> = {
  items: T
  onValueChange?: (value: T[number]['label']) => void
  defaultValue?: T[number]['label']
  value?: T[number]['label']
  popover?: React.ComponentPropsWithoutRef<typeof Popover>
  popoverTrigger?: React.ComponentPropsWithoutRef<typeof PopoverTrigger>
  popoverContent?: React.ComponentPropsWithoutRef<typeof PopoverContent>

  command?: React.ComponentPropsWithoutRef<typeof Command>
  commandInput?: React.ComponentPropsWithoutRef<typeof CommandInput>
  commandTriggerPlaceholder?: string
  commandEmpty?: string
  children: (item: T) => React.ReactNode
}

export function Combobox<T extends readonly ComboboxItemType[] | ComboboxItemType[]>({
  value,
  defaultValue,
  onValueChange,
  items,
  command,
  commandInput,
  commandEmpty = 'Nothing found.',
  commandTriggerPlaceholder = 'Select item...',
  popover,
  popoverTrigger,
  popoverContent,
  children,
}: ComboboxProps<T>) {
  React.useEffect(() => {
    if (value) {
      onValueChange?.(value)
    }
  }, [value])

  return (
    <Popover {...popover}>
      <PopoverTrigger
        {...popoverTrigger}
        secondIcon={popoverTrigger?.secondIcon || <ChevronsUpDown className="opacity-50 !size-4" />}>
        {value ? items.find((item) => item.value === (value || defaultValue))?.label : commandTriggerPlaceholder}
      </PopoverTrigger>
      <PopoverContent {...popoverContent} className={cn('w-[200px] p-0', popoverContent?.className)}>
        <Command {...command}>
          <CommandInput {...commandInput} className={cn('h-8 [&_svg]:size-[18px] px-2', commandInput)} />
          <CommandList>
            <CommandEmpty>{commandEmpty}</CommandEmpty>
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

export function ComboboxItem<T extends ComboboxItemType>({
  item,
  onSelect,
  ...props
}: {
  item: T
  onSelect: (value: T['label']) => void
} & Omit<React.ComponentPropsWithoutRef<typeof CommandItem>, 'onSelect'>) {
  return (
    <CommandItem
      key={item.value}
      value={item.value}
      onSelect={(currentValue) => {
        onSelect(currentValue as T['label'])
      }}
      {...props}>
      {item.label}
      <Check className={cn('ml-auto', item.value === item.label ? 'opacity-100' : 'opacity-0')} />
    </CommandItem>
  )
}
