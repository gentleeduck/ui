import { cn } from '@gentleduck/libs/cn'
import { Command } from 'lucide-react'
import React from 'react'
import { Button } from '../button'
import { Combobox, ComboboxItem, ComboboxItemType, ComboxGroup } from '../combobox'
import { CommandShortcut } from '../command'
import { Input } from '../input'
import { Label } from '../label'
import { Separator } from '../separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'
import { useAtom, useAtomValue } from './table.atom'
import { useDuckTable } from './table-advanced'

export function DuckTableBar({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-2 justify-between', className)} {...props} duck-table-header="" />
}

export function DuckTableRightSide({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-2 justify-center', className)} {...props} duck-table-header="" />
}

export function DuckTableLeftSide({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-2 justify-cneter', className)} {...props} duck-table-header="" />
}

export function DuckTableSearch({
  placeholder = 'Search Rows...',
  ...props
}: React.ComponentPropsWithoutRef<typeof Input>) {
  function IInput() {
    const { table } = useDuckTable()
    const query = useAtomValue(table.atoms.query)

    return (
      <Input
        className="max-w-[200px]"
        placeholder={placeholder}
        value={query}
        onChange={(e) => table.actions.setQuery(e.target.value)}
        {...props}
        duck-table-search=""
      />
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IInput />
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">
        <CommandShortcut keys={'ctrl+s'} onKeysPressed={() => {}} variant="secondary">
          <Command />
          +S
        </CommandShortcut>
        <p>Filter tasks...</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function DuckTableFilter<T extends readonly ComboboxItemType[] | ComboboxItemType[]>({
  value: defaultValue,
  items,
  heading,
  trigger,
  onValueChange,
}: {
  trigger?: React.ComponentProps<typeof Combobox>['popoverTrigger']
  onValueChange?: (value: T[number]['label']) => void
  items: T
  value?: string[]
  heading: string
}) {
  const [value, setValue] = React.useState<string[]>(defaultValue ?? [])

  return (
    <Combobox<T, 'multiple'>
      popoverTrigger={{
        ...trigger,
        className: cn('px-2', trigger?.className),
      }}
      command={{ className: 'p-1' }}
      duck-table-filter=""
      items={items}
      value={value}
      onValueChange={onValueChange as never}>
      {(items) => {
        return (
          <div className="flex gap-1 flex-col">
            <ComboxGroup heading={heading}>
              {items.map((item) => (
                <ComboboxItem<typeof item>
                  key={item.value}
                  value={item}
                  checked={value.includes(item.value)}
                  onSelect={(value) => {
                    setValue((prev) => {
                      if (prev.includes(value)) {
                        return prev.filter((item) => item !== value)
                      } else {
                        return [...prev, value]
                      }
                    })
                  }}>
                  {item.label}
                </ComboboxItem>
              ))}
            </ComboxGroup>

            {value.length > 0 && (
              <>
                <Separator />
                <Button className="w-full [&>div]:justify-center" variant={'ghost'} onClick={() => setValue([])}>
                  Clear Filter
                </Button>
              </>
            )}
          </div>
        )
      }}
    </Combobox>
  )
}

export function DuckTableColumnView<T extends readonly ComboboxItemType[] | ComboboxItemType[]>({
  value: defaultValue,
  items,
  heading,
  trigger,
  onValueChange,
}: {
  trigger?: React.ComponentProps<typeof Combobox>['popoverTrigger']
  onValueChange?: (value: T[number]['label']) => void
  items: T
  value?: string[]
  heading: string
}) {
  const [value, setValue] = React.useState<string[]>(defaultValue ?? [])

  return (
    <Combobox<T, 'multiple'>
      popoverTrigger={{
        ...trigger,
        className: cn('px-2', trigger?.className),
      }}
      command={{ className: 'p-1' }}
      duck-table-filter=""
      items={items}
      value={value}
      withSearch={false}
      showSelected={false}
      onValueChange={onValueChange as never}>
      {(items) => {
        return (
          <div className="flex gap-1 flex-col">
            <ComboxGroup className="flex flex-col">
              <Label className="p-2">{heading}</Label>
              <Separator className="mb-1" />
              {items.map((item) => (
                <ComboboxItem<typeof item>
                  key={item.value}
                  value={item}
                  className="[&_input]:border-none"
                  checked={(value.includes(item.value) ? 'indeterminate' : false) as boolean}
                  onSelect={(value) => {
                    setValue((prev) => {
                      if (prev.includes(value)) {
                        return prev.filter((item) => item !== value)
                      } else {
                        return [...prev, value]
                      }
                    })
                  }}>
                  {item.label}
                </ComboboxItem>
              ))}
            </ComboxGroup>
          </div>
        )
      }}
    </Combobox>
  )
}
