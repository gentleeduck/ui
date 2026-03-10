import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
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

export const Combobox = React.forwardRef<
  HTMLButtonElement,
  ComboboxProps<readonly ComboboxItemType[], 'single' | 'multiple'>
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
    const direction = useDirection(dir as Direction)
    const MAX_SELECTION = 2
    const _value = value ?? defaultValue

    return (
      <Popover {...popoverProps} dir={direction}>
        <PopoverTrigger asChild>
          <Button ref={ref} {...popoverTrigger} variant={popoverTrigger?.variant ?? 'dashed'}>
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
  },
) as <TData extends readonly ComboboxItemType[], TType extends 'single' | 'multiple' = 'single'>(
  props: ComboboxProps<TData, TType> & React.RefAttributes<HTMLButtonElement>,
) => React.ReactElement
;(Combobox as React.FC).displayName = 'Combobox'

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
export { ComboxGroup }

type ComboboxItemProps<T extends ComboboxItemType> = Omit<
  React.ComponentPropsWithoutRef<typeof CommandItem>,
  'onSelect'
> & {
  item: T
  onSelect?: (value: T['value']) => void
  checked?: React.ComponentPropsWithoutRef<typeof Checkbox>['checked']
}

export const ComboboxItem = React.forwardRef<
  React.ComponentRef<typeof CommandItem>,
  ComboboxItemProps<ComboboxItemType>
>(({ item, onSelect, checked, ...props }, ref) => {
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
}) as <T extends ComboboxItemType>(
  props: ComboboxItemProps<T> & React.RefAttributes<React.ComponentRef<typeof CommandItem>>,
) => React.ReactElement
;(ComboboxItem as React.FC).displayName = 'ComboboxItem'
