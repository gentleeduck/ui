import { cn } from '@gentleduck/libs/cn'
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
    ? (value: TData[number]['label']) => void
    : (value: TData[number]['label'][]) => void
  withSearch?: boolean
  showSelected?: boolean
  defaultValue?: TType extends 'single' ? TData[number]['label'] : TData[number]['label'][]
  value?: TType extends 'single' ? TData[number]['label'] : TData[number]['label'][]
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
  onValueChange,
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
  const MAX_SELECTION = 2
  React.useEffect(() => {
    if (value) {
      onValueChange?.(value as any)
    }
  }, [value])
  const _value = value ?? defaultValue

  return (
    <Popover {...popover}>
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
                      <Badge className="px-2 py-[3px] rounded-sm font-normal" variant={'secondary'}>
                        +{_value.length} Selected
                      </Badge>
                    ) : (
                      _value.map((item) => (
                        <Badge className="px-2 py-[2px] rounded-[3px] capitalize" key={item} variant={'secondary'}>
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
      <PopoverContent {...popoverContent} className={cn('w-[200px] p-0', popoverContent?.className)}>
        <Command {...command}>
          {withSearch && (
            <CommandInput {...commandInput} className={cn('h-8 [&_svg]:size-[18px] px-2', commandInput)} />
          )}
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
      <Checkbox checked={checked} className="border-foreground/50 pointer-events-none" id={item?.value} />
      {item?.label}
    </CommandItem>
  )
}
