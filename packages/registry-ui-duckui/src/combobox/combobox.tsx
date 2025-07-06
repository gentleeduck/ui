import { cn } from '@gentleduck/libs/cn'
import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { Label } from '../label'
import { Checkbox } from '../checkbox'
import { Badge } from '../badge'
import { Separator } from '../separator'

export type ComboboxItemType = {
  label: string
  value: string
}

export type ComboboxProps<
  TData extends readonly ComboboxItemType[] | ComboboxItemType[],
  TType extends 'single' | 'multiple' = 'single',
> = {
  type: 'single' | 'multiple'
  items: TData
  onValueChange?: TType extends 'single'
    ? (value: TData[number]['label']) => void
    : (value: TData[number]['label'][]) => void
  defaultValue?: TType extends 'single' ? TData[number]['label'] : TData[number]['label'][]
  value?: TType extends 'single' ? TData[number]['label'] : TData[number]['label'][]
  popover?: React.ComponentPropsWithoutRef<typeof Popover>
  popoverTrigger?: React.ComponentPropsWithoutRef<typeof PopoverTrigger>
  popoverContent?: React.ComponentPropsWithoutRef<typeof PopoverContent>
  command?: React.ComponentPropsWithoutRef<typeof Command>
  commandInput?: React.ComponentPropsWithoutRef<typeof CommandInput>
  commandTriggerPlaceholder?: string
  commandEmpty?: string
  children: (item: TData) => React.ReactNode
}

export function Combobox<
  TData extends readonly ComboboxItemType[] | ComboboxItemType[],
  TType extends 'single' | 'multiple' = 'single',
>({
  value,
  defaultValue,
  type,
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
}: ComboboxProps<TData, TType>) {
  const MAX_SELECTION = 2
  React.useEffect(() => {
    if (value) {
      onValueChange?.(value as any)
    }
  }, [value])

  return (
    <Popover {...popover}>
      <PopoverTrigger {...popoverTrigger} variant={popoverTrigger?.variant ?? 'dashed'}>
        {popoverTrigger?.children}
        {value ? (
          value instanceof Array && value.length ? (
            <>
              <Separator orientation="vertical" />
              <div className="flex gap-1">
                {value.length > MAX_SELECTION ? (
                  <Badge variant={'secondary'} className="px-2 py-[3px] rounded-[3px] font-normal">
                    +{value.length} Selected
                  </Badge>
                ) : (
                  value.map((item) => (
                    <Badge key={item} variant={'secondary'} className="px-2 py-[2px] rounded-[3px] capitalize">
                      {item}
                    </Badge>
                  ))
                )}
              </div>
            </>
          ) : (
            value
          )
        ) : (
          commandTriggerPlaceholder
        )}
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
  children,
  checked,
  ...props
}: {
  item: T
  onSelect?: (value: T['value']) => void
} & Omit<React.ComponentPropsWithoutRef<typeof CommandItem>, 'onSelect'>) {
  return (
    <CommandItem
      onSelect={() => {
        onSelect?.(item.value)
      }}
      {...props}>
      <Checkbox checked={checked} id={item.value} className="border-foreground/50 pointer-events-none" />
      {item.label}
    </CommandItem>
  )
}
