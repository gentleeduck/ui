import { Button } from '@gentleduck/registry-ui/button'
import type { ComboboxItemType } from '@gentleduck/registry-ui/combobox'
import { Combobox, ComboboxItem, ComboxGroup } from '@gentleduck/registry-ui/combobox'
import { CommandShortcut } from '@gentleduck/registry-ui/command'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Separator } from '@gentleduck/registry-ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'
import { useAtom, useAtomValue, useSetAtom } from '@gentleduck/state/react'
import { ArrowDown01, ArrowUp10, Command, Minus, ToggleLeft } from 'lucide-react'
import React from 'react'
import { cn } from './lib/utils'
import { duckTable } from './main'
import { DuckColumnValues } from './table.types'

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
  const [query, setQuery] = useAtom(duckTable.atoms.query)
  const inputValue = typeof query === 'string' ? query : ''

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="inline-flex">
            <Input
              className="h-8 max-w-[200px]"
              onChange={(e) => {
                setQuery(e.currentTarget.value)
              }}
              placeholder={placeholder}
              value={inputValue}
              {...props}
              duck-table-search=""
            />
          </div>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          <CommandShortcut variant="secondary">
            <Command />
            +S
          </CommandShortcut>
          <p>Filter tasks...</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function DuckTableFilter<T extends readonly ComboboxItemType[]>({
  value: defaultValue,
  items,
  heading,
  trigger,
  onValueChange,
}: {
  trigger?: React.ComponentProps<typeof Combobox>['popoverTrigger']
  onValueChange?: (value: T[number]['value'][]) => void
  items: T
  value?: T[number]['value'][]
  heading: string
}) {
  const [value, setValue] = React.useState<T[number]['value'][]>(defaultValue ?? [])

  return (
    <Combobox<T, 'multiple'>
      command={{ className: 'p-1' }}
      duck-table-filter=""
      items={items}
      onValueChange={onValueChange}
      popoverTrigger={{
        ...trigger,
        className: cn('px-2', trigger?.className),
      }}
      value={value}>
      {(items) => {
        return (
          <div className="flex gap-1 flex-col">
            <ComboxGroup heading={heading}>
              {items.map((item) => (
                <ComboboxItem<typeof item>
                  checked={value.includes(item.value)}
                  item={item}
                  key={item.value}
                  onSelect={(value) => {
                    setValue((prev) => {
                      if (prev.includes(value)) {
                        return prev.filter((item) => item !== value)
                      } else {
                        return [...prev, value]
                      }
                    })
                  }}
                />
              ))}
            </ComboxGroup>

            {value.length > 0 && (
              <>
                <Separator />
                <Button className="w-full [&>div]:justify-center" onClick={() => setValue([])} variant={'ghost'}>
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

/** cool */

export function DuckTableColumnView() {
  const columns = useAtomValue(duckTable.atoms.columns)
  const setVisibleColumns = useSetAtom(duckTable.atoms.visibleColumns)
  const _columns = Object.keys(columns).map((key) => {
    return {
      label: key,
      value: key,
    }
  })

  return (
    <Combobox<typeof _columns, 'multiple'>
      command={{ className: 'p-1' }}
      duck-table-filter=""
      items={_columns}
      popoverTrigger={{
        children: (
          <>
            <ToggleLeft className="!size-5" />
            <span>Columns</span>
          </>
        ),
        className: cn('px-2 h-8'),
        variant: 'outline',
      }}
      showSelected={false}
      withSearch={false}>
      {(items) => {
        return (
          <div className="flex gap-1 flex-col">
            <ComboxGroup className="flex flex-col">
              <Label className="p-2">Select Columns</Label>
              <Separator className="mb-1" />
              {items.map((item) => {
                return (
                  <ComboboxItem<typeof item>
                    checked={
                      (columns[item.label as keyof typeof columns].visible === true
                        ? 'indeterminate'
                        : false) as boolean
                    }
                    className="[&_input]:border-none capitalize"
                    item={item}
                    key={item.value}
                    onSelect={() => setVisibleColumns(item.label as keyof typeof columns)}
                  />
                )
              })}
            </ComboxGroup>
          </div>
        )
      }}
    </Combobox>
  )
}

export function DuckTableSortable({ header }: { header: DuckColumnValues }) {
  const [columns, setColumns] = useAtom(duckTable.atoms.columnSort)
  const [open, setOpen] = React.useState(false)

  const sort = columns.find((column) => column.label === header.label)?.direction
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className="-ml-1 capitalize w-fit"
          icon={sort === 'asc' ? <ArrowUp10 /> : sort === 'desc' ? <ArrowDown01 /> : ''}
          size={'sm'}
          variant={'ghost'}>
          {header.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit flex flex-col p-1 gap-1 [&_button]:w-[130px] [&_button]:justify-start">
        <Label className="font-medium text-start text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 p-2 pb-1">
          Column sort
        </Label>
        <Separator />
        {/* <PopoverClose asChild> */}
        {/*   <Button */}
        {/*     icon={<ArrowUp10 />} */}
        {/*     onClick={() => { */}
        {/*       setColumns((prev) => { */}
        {/*         return prev.map((column) => (column.label === header.label ? { ...column, direction: 'asc' } : column)) */}
        {/*       }) */}
        {/*     }} */}
        {/*     size={'sm'} */}
        {/*     variant={'ghost'}> */}
        {/*     Ascending */}
        {/*   </Button> */}
        {/* </PopoverClose> */}
        <PopoverClose asChild>
          <Button
            icon={<ArrowDown01 />}
            onClick={() => {
              setColumns((prev) => {
                return prev.map((column) => (column.label === header.label ? { ...column, direction: 'desc' } : column))
              })
            }}
            size={'sm'}
            variant={'ghost'}>
            Descending
          </Button>
        </PopoverClose>
        <Separator />
        <PopoverClose asChild>
          <Button
            icon={<Minus />}
            onClick={() => {
              setColumns((prev) => {
                return prev.map((column) => (column.label === header.label ? { ...column, direction: 'none' } : column))
              })
            }}
            size={'sm'}
            variant={'ghost'}>
            None
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
