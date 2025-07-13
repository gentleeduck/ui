import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Combobox, ComboboxItem, ComboxGroup } from '@gentleduck/registry-ui-duckui/combobox'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { useAtom, useAtomValue, useSetAtom } from '@gentleduck/state/primitive'
import { ArrowDown01, ArrowUp10, Minus, ToggleLeft } from 'lucide-react'
import React from 'react'
import { cn } from './lib/utils'
import { duck_table } from './main'
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
  function IInput() {
    const [query, setQuery] = useAtom(duck_table.atoms.query)

    return (
      <Input
        className="max-w-[200px] h-8"
        placeholder={placeholder}
        value={query as string}
        onChange={(e) => setQuery(e.target.value)}
        {...props}
        duck-table-search=""
      />
    )
  }

  return <IInput />
  // <Tooltip>
  // <TooltipTrigger asChild>
  // </TooltipTrigger>
  //   <TooltipContent className="flex items-center gap-2">
  //     <CommandShortcut keys={'ctrl+s'} onKeysPressed={() => {}} variant="secondary">
  //       <Command />
  //       +S
  //     </CommandShortcut>
  //       <p>Filter tasks...</p>
  //     </TooltipContent>
  //     </Tooltip>
}

export function DuckTableFilter<T extends readonly string[] | string[]>({
  value: defaultValue,
  items,
  heading,
  trigger,
  onValueChange,
}: {
  trigger?: React.ComponentProps<typeof Combobox>['popoverTrigger']
  onValueChange?: (value: string) => void
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
                  key={item}
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

/** cool */

export function DuckTableColumnView() {
  const columns = useAtomValue(duck_table.atoms.columns)
  const setVisibleColumns = useSetAtom(duck_table.atoms.visibleColumns)
  const _columns = Object.keys(columns)

  return (
    <Combobox<typeof _columns, 'multiple'>
      popoverTrigger={{
        variant: 'outline',
        children: (
          <>
            <ToggleLeft className="!size-5" />
            <span>Columns</span>
          </>
        ),
        className: cn('px-2 h-8'),
      }}
      command={{ className: 'p-1' }}
      duck-table-filter=""
      items={_columns}
      value={_columns}
      withSearch={false}
      showSelected={false}>
      {(items) => {
        return (
          <div className="flex gap-1 flex-col">
            <ComboxGroup className="flex flex-col">
              <Label className="p-2">Select Columns</Label>
              <Separator className="mb-1" />
              {items.map((item) => {
                console.log(columns[item as keyof typeof columns].visible)
                return (
                  <ComboboxItem<typeof item>
                    key={item}
                    value={item}
                    className="[&_input]:border-none capitalize"
                    checked={
                      (columns[item as keyof typeof columns].visible === true ? 'indeterminate' : false) as boolean
                    }
                    onSelect={() => setVisibleColumns(item as keyof typeof columns)}>
                    {item}
                  </ComboboxItem>
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
  const [columns, setColumns] = useAtom(duck_table.atoms.columnSort)
  // console.log(header, columns)

  const [open, setOpen] = React.useState(false)

  const sort = columns.find((column) => column.label === header.label)?.direction
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        size={'sm'}
        variant={'ghost'}
        className="-ml-1 capitalize"
        icon={sort === 'asc' ? <ArrowUp10 /> : sort === 'desc' ? <ArrowDown01 /> : ''}>
        {header.label}
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align={'center'}
        className="w-fit flex flex-col p-1 gap-1 [&_button]:w-[130px] [&_div]:justify-start">
        <Label className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 p-2 pb-1">
          Column sort
        </Label>
        <Separator />
        <PopoverClose
          icon={<ArrowUp10 />}
          variant={'ghost'}
          size={'sm'}
          onClick={() => {
            setColumns((prev) => {
              return prev.map((column) => (column.label === header.label ? { ...column, direction: 'asc' } : column))
            })
          }}>
          Ascending
        </PopoverClose>
        <PopoverClose
          icon={<ArrowDown01 />}
          variant={'ghost'}
          size={'sm'}
          onClick={() => {
            setColumns((prev) => {
              return prev.map((column) => (column.label === header.label ? { ...column, direction: 'desc' } : column))
            })
          }}>
          Descending
        </PopoverClose>
        <Separator />
        <PopoverClose
          icon={<Minus />}
          variant={'ghost'}
          size={'sm'}
          onClick={() => {
            setColumns((prev) => {
              return prev.map((column) => (column.label === header.label ? { ...column, direction: 'none' } : column))
            })
          }}>
          None
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
